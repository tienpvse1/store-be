-- migrate:up
ALTER TABLE public.order
  ADD COLUMN customer_name TEXT;

ALTER TABLE public.order
  ADD COLUMN customer_address TEXT;

ALTER TABLE public.order
  ADD COLUMN customer_phone TEXT;

ALTER TABLE public.order
  ADD COLUMN customer_email TEXT;

-- migrate:down

ALTER TABLE public.order
   DROP COLUMN customer_email;

ALTER TABLE public.order
   DROP COLUMN customer_phone;

ALTER TABLE public.order
   DROP COLUMN customer_address;

ALTER TABLE public.order
   DROP COLUMN customer_name;
