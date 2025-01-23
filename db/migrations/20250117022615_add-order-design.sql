-- migrate:up

CREATE TABLE public.payment_method (
name TEXT PRIMARY KEY
);
INSERT INTO public.payment_method (name) values ('COD'), ('Bank');

CREATE TABLE public.order_status (
name TEXT PRIMARY KEY
);
INSERT INTO public.order_status (name) VALUES ('New'), ('Processing'), ('Done') ;

CREATE TABLE public.order (
  id TEXT PRIMARY KEY,
  payment_method TEXT,
  order_status TEXT,
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  created_by_id INT NOT NULL,
  last_updated_by_id INT,
  last_updated_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT payment_method_fk FOREIGN KEY (payment_method)
    REFERENCES public.payment_method(name),
  CONSTRAINT order_status_fk FOREIGN KEY (order_status)
    REFERENCES public.order_status(name)
);

CREATE TABLE public.order_item (
  id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK ( quantity > 0 ),
  CONSTRAINT order_fk FOREIGN KEY (order_id)
    REFERENCES public.order(id) ON DELETE CASCADE,
  CONSTRAINT product_fk FOREIGN KEY (product_id)
    REFERENCES public.product(id)
);

-- migrate:down
DROP TABLE public.order_item;
DROP TABLE public.order;
DROP TABLE public.order_status;
DROP TABLE public.payment_method;
