-- database wx
CREATE TABLE public.location
(
    id bigserial,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    elevation numeric(5,0) NOT NULL,
    description character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT "LOCATION_pkey" PRIMARY KEY (id)
)
TABLESPACE pg_default;

COMMENT ON COLUMN public.location.elevation
    IS 'meters MSL';

CREATE TABLE public.measurement
(
    id bigserial,
    "time" timestamp without time zone NOT NULL,
    temperature numeric(4,1),
    humidity numeric(3,1),
    pressure numeric(6,2),
    location_fk bigint NOT NULL,
    CONSTRAINT "MEASUREMENT_pkey" PRIMARY KEY (id),
    CONSTRAINT location FOREIGN KEY (location_fk)
        REFERENCES public.location (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

COMMENT ON COLUMN public.measurement.temperature
    IS 'degrees F';

COMMENT ON COLUMN public.measurement.humidity
    IS '% relative';

COMMENT ON COLUMN public.measurement.pressure
    IS 'atmospheric mbar (hPa) sea level';




insert into location (latitude, longitude, elevation, description) values (<lat>, <long>, <elev m>, '<descr');
