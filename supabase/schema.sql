create extension if not exists pgcrypto;

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  rating numeric(3, 2) default 0,
  delivery_fee numeric(10, 2) default 0,
  eta_min int default 20,
  eta_max int default 40,
  min_order numeric(10, 2) default 0,
  is_open boolean default true,
  emoji text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  section text not null,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  emoji text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  store_id uuid not null references stores(id),
  store_name text not null,
  status text not null default 'received' check (status in ('received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  payment_method text not null default 'pix' check (payment_method in ('pix', 'card', 'cash')),
  change_for numeric(10, 2),
  address_street text not null,
  address_number text not null,
  address_neighborhood text not null,
  address_complement text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  name text not null,
  emoji text,
  price numeric(10, 2) not null,
  quantity int not null default 1,
  store_id uuid not null references stores(id),
  store_name text not null,
  created_at timestamptz default now()
);

create table if not exists order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz default now()
);

create or replace function create_order(
  p_user_id uuid,
  p_store_id uuid,
  p_items jsonb,
  p_address_street text,
  p_address_number text,
  p_address_neighborhood text,
  p_address_complement text default null,
  p_payment_method text default 'pix',
  p_change_for numeric default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_store record;
  v_product record;
  v_item jsonb;
  v_subtotal numeric := 0;
  v_order_id uuid;
  v_order_total numeric;
  v_profile record;
begin
  select * into v_store
  from stores
  where id = p_store_id and is_open = true;

  if v_store is null then
    raise exception 'Loja indisponível';
  end if;

  select * into v_profile from profiles where id = p_user_id;
  if v_profile is null then
    raise exception 'Usuário inválido';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and store_id = p_store_id
      and is_active = true;

    if v_product is null then
      raise exception 'Produto inválido para esta loja';
    end if;

    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::int);
  end loop;

  if v_subtotal < v_store.min_order then
    raise exception 'Pedido abaixo do mínimo';
  end if;

  v_order_total := v_subtotal + v_store.delivery_fee;

  insert into orders (
    user_id,
    store_id,
    store_name,
    subtotal,
    delivery_fee,
    total,
    payment_method,
    change_for,
    address_street,
    address_number,
    address_neighborhood,
    address_complement,
    status
  )
  values (
    p_user_id,
    p_store_id,
    v_store.name,
    v_subtotal,
    v_store.delivery_fee,
    v_order_total,
    p_payment_method,
    p_change_for,
    p_address_street,
    p_address_number,
    p_address_neighborhood,
    p_address_complement,
    'received'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and store_id = p_store_id;

    insert into order_items (
      order_id,
      product_id,
      name,
      emoji,
      price,
      quantity,
      store_id,
      store_name
    )
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.emoji,
      v_product.price,
      (v_item->>'quantity')::int,
      p_store_id,
      v_store.name
    );
  end loop;

  insert into order_events (order_id, status, note)
  values (v_order_id, 'received', 'Pedido criado pelo cliente');

  return jsonb_build_object(
    'id', v_order_id,
    'status', 'received',
    'subtotal', v_subtotal,
    'delivery_fee', v_store.delivery_fee,
    'total', v_order_total
  );
end;
$$;

create or replace function get_orders_by_user(p_user_id uuid)
returns table (
  id uuid,
  store_id uuid,
  store_name text,
  status text,
  subtotal numeric,
  delivery_fee numeric,
  total numeric,
  payment_method text,
  change_for numeric,
  address_street text,
  address_number text,
  address_neighborhood text,
  address_complement text,
  created_at timestamptz
)
language sql
security definer
as $$
  select
    o.id,
    o.store_id,
    o.store_name,
    o.status,
    o.subtotal,
    o.delivery_fee,
    o.total,
    o.payment_method,
    o.change_for,
    o.address_street,
    o.address_number,
    o.address_neighborhood,
    o.address_complement,
    o.created_at
  from orders o
  where o.user_id = p_user_id
  order by o.created_at desc;
$$;

alter table stores enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "stores are viewable by everyone" on stores;
drop policy if exists "products are viewable by everyone" on products;
drop policy if exists "orders are viewable by owner" on orders;
drop policy if exists "orders can be inserted by owner" on orders;
drop policy if exists "order items are viewable by owner" on order_items;

create policy "stores are viewable by everyone"
on stores for select using (true);
create policy "products are viewable by everyone"
on products for select using (true);
create policy "orders are viewable by owner"
on orders for select using (auth.uid() = user_id);
create policy "orders can be inserted by owner"
on orders for insert with check (auth.uid() = user_id);
create policy "order items are viewable by owner"
on order_items for select using (exists (
  select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid()
));
