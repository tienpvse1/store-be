-- migrate:up
CREATE TABLE public.category (name TEXT PRIMARY KEY);

CREATE TABLE public.product (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC CHECK (price > 0),
  quantity INT CHECK (quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  created_by_id INT NOT NULL,
  updated_by_id INT,
  CONSTRAINT created_by_fk FOREIGN KEY (created_by_id) REFERENCES public.user (id),
  CONSTRAINT updated_by_fk FOREIGN KEY (updated_by_id) REFERENCES public.user (id)
);

CREATE TABLE public.product_category (
  product_id INT NOT NULL,
  category_name TEXT NOT NULL,
  CONSTRAINT product_category_pk PRIMARY KEY (product_id, category_name),
  CONSTRAINT product_fk FOREIGN KEY (product_id) REFERENCES public.product (id),
  CONSTRAINT category_fk FOREIGN KEY (category_name) REFERENCES public.category (name)
);

-- migrate:down
DROP TABLE public.product_category;

DROP TABLE public.product;

DROP TABLE public.category;
