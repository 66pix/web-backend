--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.2
-- Dumped by pg_dump version 9.5.3

-- Started on 2016-08-19 12:53:03 NZST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 10 (class 2615 OID 257119)
-- Name: audit; Type: SCHEMA; Schema: -; Owner: lambci_test
--

CREATE SCHEMA audit;


ALTER SCHEMA audit OWNER TO lambci_test;

--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 10
-- Name: SCHEMA audit; Type: COMMENT; Schema: -; Owner: lambci_test
--

COMMENT ON SCHEMA audit IS 'Out-of-table audit/history logging tables and trigger functions';


--
-- TOC entry 9 (class 2615 OID 256663)
-- Name: web; Type: SCHEMA; Schema: -; Owner: lambci_test
--

CREATE SCHEMA web;


ALTER SCHEMA web OWNER TO lambci_test;

--
-- TOC entry 1 (class 3079 OID 13276)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 256023)
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET search_path = web, pg_catalog;

--
-- TOC entry 663 (class 1247 OID 256670)
-- Name: enum_company_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_company_status AS ENUM (
    'Active',
    'Inactive',
    'Deleted'
);


ALTER TYPE enum_company_status OWNER TO lambci_test;

--
-- TOC entry 666 (class 1247 OID 256678)
-- Name: enum_container_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_container_status AS ENUM (
    'Active',
    'Inactive',
    'Deleted'
);


ALTER TYPE enum_container_status OWNER TO lambci_test;

--
-- TOC entry 669 (class 1247 OID 256686)
-- Name: enum_container_video_type; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_container_video_type AS ENUM (
    'YouTube',
    'Vimeo'
);


ALTER TYPE enum_container_video_type OWNER TO lambci_test;

--
-- TOC entry 672 (class 1247 OID 256692)
-- Name: enum_download_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_download_status AS ENUM (
    'In Progress',
    'Pending',
    'Completed',
    'Error'
);


ALTER TYPE enum_download_status OWNER TO lambci_test;

--
-- TOC entry 675 (class 1247 OID 256702)
-- Name: enum_job_item_container_image_mapping_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_job_item_container_image_mapping_status AS ENUM (
    'In Progress',
    'Deleted',
    'Completed',
    'Rejected'
);


ALTER TYPE enum_job_item_container_image_mapping_status OWNER TO lambci_test;

--
-- TOC entry 678 (class 1247 OID 256712)
-- Name: enum_job_item_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_job_item_status AS ENUM (
    'In Progress',
    'In Review',
    'Deleted',
    'Completed',
    'Rejected'
);


ALTER TYPE enum_job_item_status OWNER TO lambci_test;

--
-- TOC entry 681 (class 1247 OID 256724)
-- Name: enum_job_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_job_status AS ENUM (
    'In Progress',
    'Deleted',
    'Completed',
    'Created'
);


ALTER TYPE enum_job_status OWNER TO lambci_test;

--
-- TOC entry 684 (class 1247 OID 256734)
-- Name: enum_token_type; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_token_type AS ENUM (
    'Login',
    'Reset Password'
);


ALTER TYPE enum_token_type OWNER TO lambci_test;

--
-- TOC entry 687 (class 1247 OID 256740)
-- Name: enum_tree_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_tree_status AS ENUM (
    'Active',
    'Inactive',
    'Deleted'
);


ALTER TYPE enum_tree_status OWNER TO lambci_test;

--
-- TOC entry 690 (class 1247 OID 256748)
-- Name: enum_user_account_company_responsibility; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_user_account_company_responsibility AS ENUM (
    'Owner',
    'Editor',
    'Viewer',
    'Connection'
);


ALTER TYPE enum_user_account_company_responsibility OWNER TO lambci_test;

--
-- TOC entry 693 (class 1247 OID 256758)
-- Name: enum_user_account_company_tree_responsibility; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_user_account_company_tree_responsibility AS ENUM (
    'Owner',
    'Editor',
    'Viewer'
);


ALTER TYPE enum_user_account_company_tree_responsibility OWNER TO lambci_test;

--
-- TOC entry 696 (class 1247 OID 256766)
-- Name: enum_user_account_status; Type: TYPE; Schema: web; Owner: lambci_test
--

CREATE TYPE enum_user_account_status AS ENUM (
    'Active',
    'Inactive',
    'Deleted',
    'Pending'
);


ALTER TYPE enum_user_account_status OWNER TO lambci_test;

SET search_path = audit, pg_catalog;

--
-- TOC entry 299 (class 1255 OID 257138)
-- Name: audit_table(regclass); Type: FUNCTION; Schema: audit; Owner: lambci_test
--

CREATE FUNCTION audit_table(target_table regclass) RETURNS void
    LANGUAGE sql
    AS $_$
SELECT audit.audit_table($1, BOOLEAN 't', BOOLEAN 't');
$_$;


ALTER FUNCTION audit.audit_table(target_table regclass) OWNER TO lambci_test;

--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 299
-- Name: FUNCTION audit_table(target_table regclass); Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON FUNCTION audit_table(target_table regclass) IS '
Add auditing support to the given table. Row-level changes will be logged with full client query text. No cols are ignored.
';


--
-- TOC entry 298 (class 1255 OID 257137)
-- Name: audit_table(regclass, boolean, boolean); Type: FUNCTION; Schema: audit; Owner: lambci_test
--

CREATE FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) RETURNS void
    LANGUAGE sql
    AS $_$
SELECT audit.audit_table($1, $2, $3, ARRAY[]::text[]);
$_$;


ALTER FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean) OWNER TO lambci_test;

--
-- TOC entry 297 (class 1255 OID 257136)
-- Name: audit_table(regclass, boolean, boolean, text[]); Type: FUNCTION; Schema: audit; Owner: lambci_test
--

CREATE FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  stm_targets text = 'INSERT OR UPDATE OR DELETE OR TRUNCATE';
  _q_txt text;
  _ignored_cols_snip text = '';
BEGIN
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_row ON ' || target_table::TEXT;
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_stm ON ' || target_table::TEXT;

    IF audit_rows THEN
        IF array_length(ignored_cols,1) > 0 THEN
            _ignored_cols_snip = ', ' || quote_literal(ignored_cols);
        END IF;
        _q_txt = 'CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON ' ||
                 target_table::TEXT ||
                 ' FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func(' ||
                 quote_literal(audit_query_text) || _ignored_cols_snip || ');';
        RAISE NOTICE '%',_q_txt;
        EXECUTE _q_txt;
        stm_targets = 'TRUNCATE';
    ELSE
    END IF;

    _q_txt = 'CREATE TRIGGER audit_trigger_stm AFTER ' || stm_targets || ' ON ' ||
             target_table ||
             ' FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('||
             quote_literal(audit_query_text) || ');';
    RAISE NOTICE '%',_q_txt;
    EXECUTE _q_txt;

END;
$$;


ALTER FUNCTION audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) OWNER TO lambci_test;

--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 297
-- Name: FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]); Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON FUNCTION audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, ignored_cols text[]) IS '
Add auditing support to a table.

Arguments:
   target_table:     Table name, schema qualified if not on search_path
   audit_rows:       Record each row change, or only audit at a statement level
   audit_query_text: Record the text of the client query that triggered the audit event?
   ignored_cols:     Columns to exclude from update diffs, ignore updates that change only ignored cols.
';


--
-- TOC entry 296 (class 1255 OID 257135)
-- Name: if_modified_func(); Type: FUNCTION; Schema: audit; Owner: lambci_test
--

CREATE FUNCTION if_modified_func() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO pg_catalog, public
    AS $$
DECLARE
    audit_row audit.logged_action;
    include_values boolean;
    log_diffs boolean;
    h_old hstore;
    h_new hstore;
    excluded_cols text[] = ARRAY[]::text[];
BEGIN
    IF TG_WHEN <> 'AFTER' THEN
        RAISE EXCEPTION 'audit.if_modified_func() may only run as an AFTER trigger';
    END IF;

    audit_row = ROW(
        nextval('audit.logged_action_event_id_seq'), -- event_id
        TG_TABLE_SCHEMA::text,                        -- schema_name
        TG_TABLE_NAME::text,                          -- table_name
        TG_RELID,                                     -- relation OID for much quicker searches
        session_user::text,                           -- session_user_name
        current_timestamp,                            -- action_tstamp_tx
        statement_timestamp(),                        -- action_tstamp_stm
        clock_timestamp(),                            -- action_tstamp_clk
        txid_current(),                               -- transaction ID
        current_setting('application_name'),          -- client application
        inet_client_addr(),                           -- client_addr
        inet_client_port(),                           -- client_port
        current_query(),                              -- top-level query or queries (if multistatement) from client
        substring(TG_OP,1,1),                         -- action
        NULL, NULL,                                   -- row_data, changed_fields
        'f'                                           -- statement_only
        );

    IF NOT TG_ARGV[0]::boolean IS DISTINCT FROM 'f'::boolean THEN
        audit_row.client_query = NULL;
    END IF;

    IF TG_ARGV[1] IS NOT NULL THEN
        excluded_cols = TG_ARGV[1]::text[];
    END IF;

    IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(OLD.*) - excluded_cols;
        audit_row.changed_fields =  (hstore(NEW.*) - audit_row.row_data) - excluded_cols;
        IF audit_row.changed_fields = hstore('') THEN
            -- All changed fields are ignored. Skip this update.
            RETURN NULL;
        END IF;
    ELSIF (TG_OP = 'DELETE' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(OLD.*) - excluded_cols;
    ELSIF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
        audit_row.row_data = hstore(NEW.*) - excluded_cols;
    ELSIF (TG_LEVEL = 'STATEMENT' AND TG_OP IN ('INSERT','UPDATE','DELETE','TRUNCATE')) THEN
        audit_row.statement_only = 't';
    ELSE
        RAISE EXCEPTION '[audit.if_modified_func] - Trigger func added as trigger for unhandled case: %, %',TG_OP, TG_LEVEL;
        RETURN NULL;
    END IF;
    INSERT INTO audit.logged_action VALUES (audit_row.*);
    RETURN NULL;
END;
$$;


ALTER FUNCTION audit.if_modified_func() OWNER TO lambci_test;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 296
-- Name: FUNCTION if_modified_func(); Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON FUNCTION if_modified_func() IS '
Track changes to a table at the statement and/or row level.

Optional parameters to trigger in CREATE TRIGGER call:

param 0: boolean, whether to log the query text. Default ''t''.

param 1: text[], columns to ignore in updates. Default [].

         Updates to ignored cols are omitted from changed_fields.

         Updates with only ignored cols changed are not inserted
         into the audit log.

         Almost all the processing work is still done for updates
         that ignored. If you need to save the load, you need to use
         WHEN clause on the trigger instead.

         No warning or error is issued if ignored_cols contains columns
         that do not exist in the target table. This lets you specify
         a standard set of ignored columns.

There is no parameter to disable logging of values. Add this trigger as
a ''FOR EACH STATEMENT'' rather than ''FOR EACH ROW'' trigger if you do not
want to log row values.

Note that the user name logged is the login role for the session. The audit trigger
cannot obtain the active role because it is reset by the SECURITY DEFINER invocation
of the audit trigger its self.
';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 226 (class 1259 OID 257122)
-- Name: logged_action; Type: TABLE; Schema: audit; Owner: lambci_test
--

CREATE TABLE logged_action (
    event_id bigint NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    relid oid NOT NULL,
    session_user_name text,
    action_tstamp_tx timestamp with time zone NOT NULL,
    action_tstamp_stm timestamp with time zone NOT NULL,
    action_tstamp_clk timestamp with time zone NOT NULL,
    transaction_id bigint,
    application_name text,
    client_addr inet,
    client_port integer,
    client_query text,
    action text NOT NULL,
    row_data public.hstore,
    changed_fields public.hstore,
    statement_only boolean NOT NULL,
    CONSTRAINT logged_action_action_check CHECK ((action = ANY (ARRAY['I'::text, 'D'::text, 'U'::text, 'T'::text])))
);


ALTER TABLE logged_action OWNER TO lambci_test;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE logged_action; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON TABLE logged_action IS 'History of auditable actions on audited tables, from audit.if_modified_func()';


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.event_id; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.event_id IS 'Unique identifier for each auditable event';


--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.schema_name; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.schema_name IS 'Database schema audited table for this event is in';


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.table_name; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.table_name IS 'Non-schema-qualified table name of table event occured in';


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.relid; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.relid IS 'Table OID. Changes with drop/create. Get with ''tablename''::regclass';


--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.session_user_name; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.session_user_name IS 'Login / session user whose statement caused the audited event';


--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.action_tstamp_tx; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.action_tstamp_tx IS 'Transaction start timestamp for tx in which audited event occurred';


--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.action_tstamp_stm; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.action_tstamp_stm IS 'Statement start timestamp for tx in which audited event occurred';


--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.action_tstamp_clk; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.action_tstamp_clk IS 'Wall clock time at which audited event''s trigger call occurred';


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.transaction_id; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.transaction_id IS 'Identifier of transaction that made the change. May wrap, but unique paired with action_tstamp_tx.';


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.application_name; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.application_name IS 'Application name set when this audit event occurred. Can be changed in-session by client.';


--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.client_addr; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.client_addr IS 'IP address of client that issued query. Null for unix domain socket.';


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.client_port; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.client_port IS 'Remote peer IP port address of client that issued query. Undefined for unix socket.';


--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.client_query; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.client_query IS 'Top-level query that caused this auditable event. May be more than one statement.';


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.action; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.action IS 'Action type; I = insert, D = delete, U = update, T = truncate';


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.row_data; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.row_data IS 'Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.';


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.changed_fields; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.changed_fields IS 'New values of fields changed by UPDATE. Null except for row-level UPDATE events.';


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN logged_action.statement_only; Type: COMMENT; Schema: audit; Owner: lambci_test
--

COMMENT ON COLUMN logged_action.statement_only IS '''t'' if audit event is from an FOR EACH STATEMENT trigger, ''f'' for FOR EACH ROW';


--
-- TOC entry 225 (class 1259 OID 257120)
-- Name: logged_action_event_id_seq; Type: SEQUENCE; Schema: audit; Owner: lambci_test
--

CREATE SEQUENCE logged_action_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE logged_action_event_id_seq OWNER TO lambci_test;

--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 225
-- Name: logged_action_event_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: lambci_test
--

ALTER SEQUENCE logged_action_event_id_seq OWNED BY logged_action.event_id;


SET search_path = web, pg_catalog;

--
-- TOC entry 184 (class 1259 OID 256664)
-- Name: SequelizeMeta; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE "SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE "SequelizeMeta" OWNER TO lambci_test;

--
-- TOC entry 185 (class 1259 OID 256775)
-- Name: company; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE company (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "phoneNumber" character varying(255),
    logo character varying(255),
    status enum_company_status,
    "paymentToken" character varying(255),
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE company OWNER TO lambci_test;

--
-- TOC entry 186 (class 1259 OID 256781)
-- Name: company_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE company_id_seq OWNER TO lambci_test;

--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 186
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE company_id_seq OWNED BY company.id;


--
-- TOC entry 187 (class 1259 OID 256783)
-- Name: company_plan; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE company_plan (
    id integer NOT NULL,
    detail json,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "companyId" integer
);


ALTER TABLE company_plan OWNER TO lambci_test;

--
-- TOC entry 188 (class 1259 OID 256789)
-- Name: company_plan_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE company_plan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE company_plan_id_seq OWNER TO lambci_test;

--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 188
-- Name: company_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE company_plan_id_seq OWNED BY company_plan.id;


--
-- TOC entry 189 (class 1259 OID 256791)
-- Name: container; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container (
    id integer NOT NULL,
    name character varying(255),
    status enum_container_status,
    code character varying(255),
    "treeId" integer,
    "isRoot" boolean,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container OWNER TO lambci_test;

--
-- TOC entry 190 (class 1259 OID 256797)
-- Name: container_container_mapping; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_container_mapping (
    "parentContainerId" integer NOT NULL,
    "childContainerId" integer NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_container_mapping OWNER TO lambci_test;

--
-- TOC entry 191 (class 1259 OID 256800)
-- Name: container_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_id_seq OWNER TO lambci_test;

--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 191
-- Name: container_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_id_seq OWNED BY container.id;


--
-- TOC entry 192 (class 1259 OID 256802)
-- Name: container_image; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_image (
    id integer NOT NULL,
    name character varying(255),
    meta json,
    url character varying(255),
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_image OWNER TO lambci_test;

--
-- TOC entry 193 (class 1259 OID 256808)
-- Name: container_image_container_mapping; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_image_container_mapping (
    id integer NOT NULL,
    "containerImageId" integer,
    "containerId" integer,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_image_container_mapping OWNER TO lambci_test;

--
-- TOC entry 194 (class 1259 OID 256811)
-- Name: container_image_container_mapping_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_image_container_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_image_container_mapping_id_seq OWNER TO lambci_test;

--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 194
-- Name: container_image_container_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_image_container_mapping_id_seq OWNED BY container_image_container_mapping.id;


--
-- TOC entry 195 (class 1259 OID 256813)
-- Name: container_image_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_image_id_seq OWNER TO lambci_test;

--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 195
-- Name: container_image_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_image_id_seq OWNED BY container_image.id;


--
-- TOC entry 196 (class 1259 OID 256815)
-- Name: container_image_tag; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_image_tag (
    id integer NOT NULL,
    name character varying(255),
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_image_tag OWNER TO lambci_test;

--
-- TOC entry 197 (class 1259 OID 256818)
-- Name: container_image_tag_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_image_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_image_tag_id_seq OWNER TO lambci_test;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 197
-- Name: container_image_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_image_tag_id_seq OWNED BY container_image_tag.id;


--
-- TOC entry 198 (class 1259 OID 256820)
-- Name: container_image_tag_mapping; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_image_tag_mapping (
    id integer NOT NULL,
    "containerImageTagId" integer,
    "containerImageId" integer,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_image_tag_mapping OWNER TO lambci_test;

--
-- TOC entry 199 (class 1259 OID 256823)
-- Name: container_image_tag_mapping_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_image_tag_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_image_tag_mapping_id_seq OWNER TO lambci_test;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 199
-- Name: container_image_tag_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_image_tag_mapping_id_seq OWNED BY container_image_tag_mapping.id;


--
-- TOC entry 200 (class 1259 OID 256825)
-- Name: container_text; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_text (
    id integer NOT NULL,
    name character varying(255),
    value text,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_text OWNER TO lambci_test;

--
-- TOC entry 201 (class 1259 OID 256831)
-- Name: container_text_container_mapping; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_text_container_mapping (
    id integer NOT NULL,
    "containerTextId" integer,
    "containerId" integer,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_text_container_mapping OWNER TO lambci_test;

--
-- TOC entry 202 (class 1259 OID 256834)
-- Name: container_text_container_mapping_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_text_container_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_text_container_mapping_id_seq OWNER TO lambci_test;

--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 202
-- Name: container_text_container_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_text_container_mapping_id_seq OWNED BY container_text_container_mapping.id;


--
-- TOC entry 203 (class 1259 OID 256836)
-- Name: container_text_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_text_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_text_id_seq OWNER TO lambci_test;

--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 203
-- Name: container_text_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_text_id_seq OWNED BY container_text.id;


--
-- TOC entry 204 (class 1259 OID 256838)
-- Name: container_video; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_video (
    id integer NOT NULL,
    name character varying(255),
    type enum_container_video_type,
    url character varying(255),
    thumbnail character varying(255),
    "thumbnailHeight" integer,
    "thumbnailWidth" integer,
    author character varying(255),
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_video OWNER TO lambci_test;

--
-- TOC entry 205 (class 1259 OID 256844)
-- Name: container_video_container_mapping; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE container_video_container_mapping (
    id integer NOT NULL,
    "containerVideoId" integer,
    "containerId" integer,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE container_video_container_mapping OWNER TO lambci_test;

--
-- TOC entry 206 (class 1259 OID 256847)
-- Name: container_video_container_mapping_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_video_container_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_video_container_mapping_id_seq OWNER TO lambci_test;

--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 206
-- Name: container_video_container_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_video_container_mapping_id_seq OWNED BY container_video_container_mapping.id;


--
-- TOC entry 207 (class 1259 OID 256849)
-- Name: container_video_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE container_video_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE container_video_id_seq OWNER TO lambci_test;

--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 207
-- Name: container_video_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE container_video_id_seq OWNED BY container_video.id;


--
-- TOC entry 208 (class 1259 OID 256851)
-- Name: download; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE download (
    id integer NOT NULL,
    "userAccountId" integer,
    "treeId" integer,
    "downloadEntireTree" boolean,
    "containerIds" integer[],
    "containerImageIds" integer[],
    "containerVideoIds" integer[],
    "containerTextIds" integer[],
    "selectedContainerId" integer,
    error text,
    status enum_download_status,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE download OWNER TO lambci_test;

--
-- TOC entry 209 (class 1259 OID 256857)
-- Name: download_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE download_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE download_id_seq OWNER TO lambci_test;

--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 209
-- Name: download_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE download_id_seq OWNED BY download.id;


--
-- TOC entry 210 (class 1259 OID 256859)
-- Name: job; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE job (
    id integer NOT NULL,
    notes character varying(255),
    "creatorId" integer NOT NULL,
    "ownerId" integer NOT NULL,
    "assigneeId" integer,
    "companyId" integer NOT NULL,
    status enum_job_status NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE job OWNER TO lambci_test;

--
-- TOC entry 211 (class 1259 OID 256862)
-- Name: job_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE job_id_seq OWNER TO lambci_test;

--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 211
-- Name: job_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE job_id_seq OWNED BY job.id;


--
-- TOC entry 212 (class 1259 OID 256864)
-- Name: job_item; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE job_item (
    id integer NOT NULL,
    notes character varying(255),
    "jobId" integer NOT NULL,
    "containerId" integer NOT NULL,
    status enum_job_item_status NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE job_item OWNER TO lambci_test;

--
-- TOC entry 213 (class 1259 OID 256867)
-- Name: job_item_container_image_mapping; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE job_item_container_image_mapping (
    notes character varying(255),
    "jobItemId" integer NOT NULL,
    "containerImageId" integer NOT NULL,
    status enum_job_item_container_image_mapping_status NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE job_item_container_image_mapping OWNER TO lambci_test;

--
-- TOC entry 214 (class 1259 OID 256870)
-- Name: job_item_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE job_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE job_item_id_seq OWNER TO lambci_test;

--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 214
-- Name: job_item_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE job_item_id_seq OWNED BY job_item.id;


--
-- TOC entry 215 (class 1259 OID 256872)
-- Name: token; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE token (
    id integer NOT NULL,
    "userAccountId" integer NOT NULL,
    "userAgent" character varying(255) NOT NULL,
    "expiresOn" timestamp with time zone,
    type enum_token_type NOT NULL,
    "isRevoked" boolean DEFAULT false,
    payload character varying(255) NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE token OWNER TO lambci_test;

--
-- TOC entry 216 (class 1259 OID 256879)
-- Name: token_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE token_id_seq OWNER TO lambci_test;

--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 216
-- Name: token_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE token_id_seq OWNED BY token.id;


--
-- TOC entry 217 (class 1259 OID 256881)
-- Name: tree; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE tree (
    id integer NOT NULL,
    name character varying(255),
    status enum_tree_status,
    "companyId" integer NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE tree OWNER TO lambci_test;

--
-- TOC entry 218 (class 1259 OID 256884)
-- Name: tree_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE tree_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tree_id_seq OWNER TO lambci_test;

--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 218
-- Name: tree_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE tree_id_seq OWNED BY tree.id;


--
-- TOC entry 219 (class 1259 OID 256886)
-- Name: user_account; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE user_account (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    password character varying(255),
    status enum_user_account_status,
    "lockUntil" timestamp with time zone,
    "loginAttempts" integer DEFAULT 0,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE user_account OWNER TO lambci_test;

--
-- TOC entry 220 (class 1259 OID 256893)
-- Name: user_account_company; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE user_account_company (
    id integer NOT NULL,
    "isSelected" boolean,
    responsibility enum_user_account_company_responsibility NOT NULL,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userAccountId" integer,
    "companyId" integer
);


ALTER TABLE user_account_company OWNER TO lambci_test;

--
-- TOC entry 221 (class 1259 OID 256896)
-- Name: user_account_company_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE user_account_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_account_company_id_seq OWNER TO lambci_test;

--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_account_company_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE user_account_company_id_seq OWNED BY user_account_company.id;


--
-- TOC entry 222 (class 1259 OID 256898)
-- Name: user_account_company_tree; Type: TABLE; Schema: web; Owner: lambci_test
--

CREATE TABLE user_account_company_tree (
    id integer NOT NULL,
    "userAccountCompanyId" integer NOT NULL,
    "treeId" integer NOT NULL,
    responsibility enum_user_account_company_tree_responsibility,
    "updatedWithToken" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE user_account_company_tree OWNER TO lambci_test;

--
-- TOC entry 223 (class 1259 OID 256901)
-- Name: user_account_company_tree_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE user_account_company_tree_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_account_company_tree_id_seq OWNER TO lambci_test;

--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_account_company_tree_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE user_account_company_tree_id_seq OWNED BY user_account_company_tree.id;


--
-- TOC entry 224 (class 1259 OID 256903)
-- Name: user_account_id_seq; Type: SEQUENCE; Schema: web; Owner: lambci_test
--

CREATE SEQUENCE user_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_account_id_seq OWNER TO lambci_test;

--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 224
-- Name: user_account_id_seq; Type: SEQUENCE OWNED BY; Schema: web; Owner: lambci_test
--

ALTER SEQUENCE user_account_id_seq OWNED BY user_account.id;


SET search_path = audit, pg_catalog;

--
-- TOC entry 3196 (class 2604 OID 257125)
-- Name: event_id; Type: DEFAULT; Schema: audit; Owner: lambci_test
--

ALTER TABLE ONLY logged_action ALTER COLUMN event_id SET DEFAULT nextval('logged_action_event_id_seq'::regclass);


SET search_path = web, pg_catalog;

--
-- TOC entry 3175 (class 2604 OID 256905)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY company ALTER COLUMN id SET DEFAULT nextval('company_id_seq'::regclass);


--
-- TOC entry 3176 (class 2604 OID 256906)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY company_plan ALTER COLUMN id SET DEFAULT nextval('company_plan_id_seq'::regclass);


--
-- TOC entry 3177 (class 2604 OID 256907)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container ALTER COLUMN id SET DEFAULT nextval('container_id_seq'::regclass);


--
-- TOC entry 3178 (class 2604 OID 256908)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image ALTER COLUMN id SET DEFAULT nextval('container_image_id_seq'::regclass);


--
-- TOC entry 3179 (class 2604 OID 256909)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_container_mapping ALTER COLUMN id SET DEFAULT nextval('container_image_container_mapping_id_seq'::regclass);


--
-- TOC entry 3180 (class 2604 OID 256910)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag ALTER COLUMN id SET DEFAULT nextval('container_image_tag_id_seq'::regclass);


--
-- TOC entry 3181 (class 2604 OID 256911)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag_mapping ALTER COLUMN id SET DEFAULT nextval('container_image_tag_mapping_id_seq'::regclass);


--
-- TOC entry 3182 (class 2604 OID 256912)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text ALTER COLUMN id SET DEFAULT nextval('container_text_id_seq'::regclass);


--
-- TOC entry 3183 (class 2604 OID 256913)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text_container_mapping ALTER COLUMN id SET DEFAULT nextval('container_text_container_mapping_id_seq'::regclass);


--
-- TOC entry 3184 (class 2604 OID 256914)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video ALTER COLUMN id SET DEFAULT nextval('container_video_id_seq'::regclass);


--
-- TOC entry 3185 (class 2604 OID 256915)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video_container_mapping ALTER COLUMN id SET DEFAULT nextval('container_video_container_mapping_id_seq'::regclass);


--
-- TOC entry 3186 (class 2604 OID 256916)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY download ALTER COLUMN id SET DEFAULT nextval('download_id_seq'::regclass);


--
-- TOC entry 3187 (class 2604 OID 256917)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job ALTER COLUMN id SET DEFAULT nextval('job_id_seq'::regclass);


--
-- TOC entry 3188 (class 2604 OID 256918)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item ALTER COLUMN id SET DEFAULT nextval('job_item_id_seq'::regclass);


--
-- TOC entry 3190 (class 2604 OID 256919)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY token ALTER COLUMN id SET DEFAULT nextval('token_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 256920)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY tree ALTER COLUMN id SET DEFAULT nextval('tree_id_seq'::regclass);


--
-- TOC entry 3193 (class 2604 OID 256921)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account ALTER COLUMN id SET DEFAULT nextval('user_account_id_seq'::regclass);


--
-- TOC entry 3194 (class 2604 OID 256922)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company ALTER COLUMN id SET DEFAULT nextval('user_account_company_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 256923)
-- Name: id; Type: DEFAULT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company_tree ALTER COLUMN id SET DEFAULT nextval('user_account_company_tree_id_seq'::regclass);


SET search_path = audit, pg_catalog;

--
-- TOC entry 3262 (class 2606 OID 257131)
-- Name: logged_action_pkey; Type: CONSTRAINT; Schema: audit; Owner: lambci_test
--

ALTER TABLE ONLY logged_action
    ADD CONSTRAINT logged_action_pkey PRIMARY KEY (event_id);


SET search_path = web, pg_catalog;

--
-- TOC entry 3199 (class 2606 OID 256668)
-- Name: SequelizeMeta_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY "SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 3201 (class 2606 OID 256925)
-- Name: company_name_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY company
    ADD CONSTRAINT company_name_key UNIQUE (name);


--
-- TOC entry 3203 (class 2606 OID 256927)
-- Name: company_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 256929)
-- Name: company_plan_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY company_plan
    ADD CONSTRAINT company_plan_pkey PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 256931)
-- Name: container_container_mapping_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_container_mapping
    ADD CONSTRAINT container_container_mapping_pkey PRIMARY KEY ("parentContainerId", "childContainerId");


--
-- TOC entry 3213 (class 2606 OID 256933)
-- Name: container_image_container_mapp_containerImageId_containerId_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_container_mapping
    ADD CONSTRAINT "container_image_container_mapp_containerImageId_containerId_key" UNIQUE ("containerImageId", "containerId");


--
-- TOC entry 3215 (class 2606 OID 256935)
-- Name: container_image_container_mapping_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_container_mapping
    ADD CONSTRAINT container_image_container_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 256937)
-- Name: container_image_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image
    ADD CONSTRAINT container_image_pkey PRIMARY KEY (id);


--
-- TOC entry 3219 (class 2606 OID 256939)
-- Name: container_image_tag_mapping_containerImageTagId_containerIm_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag_mapping
    ADD CONSTRAINT "container_image_tag_mapping_containerImageTagId_containerIm_key" UNIQUE ("containerImageTagId", "containerImageId");


--
-- TOC entry 3221 (class 2606 OID 256941)
-- Name: container_image_tag_mapping_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag_mapping
    ADD CONSTRAINT container_image_tag_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 256943)
-- Name: container_image_tag_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag
    ADD CONSTRAINT container_image_tag_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 256945)
-- Name: container_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container
    ADD CONSTRAINT container_pkey PRIMARY KEY (id);


--
-- TOC entry 3225 (class 2606 OID 256947)
-- Name: container_text_container_mappin_containerTextId_containerId_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text_container_mapping
    ADD CONSTRAINT "container_text_container_mappin_containerTextId_containerId_key" UNIQUE ("containerTextId", "containerId");


--
-- TOC entry 3227 (class 2606 OID 256949)
-- Name: container_text_container_mapping_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text_container_mapping
    ADD CONSTRAINT container_text_container_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 3223 (class 2606 OID 256951)
-- Name: container_text_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text
    ADD CONSTRAINT container_text_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 256953)
-- Name: container_video_container_mapp_containerVideoId_containerId_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video_container_mapping
    ADD CONSTRAINT "container_video_container_mapp_containerVideoId_containerId_key" UNIQUE ("containerVideoId", "containerId");


--
-- TOC entry 3233 (class 2606 OID 256955)
-- Name: container_video_container_mapping_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video_container_mapping
    ADD CONSTRAINT container_video_container_mapping_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 256957)
-- Name: container_video_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video
    ADD CONSTRAINT container_video_pkey PRIMARY KEY (id);


--
-- TOC entry 3235 (class 2606 OID 256959)
-- Name: download_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY download
    ADD CONSTRAINT download_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 256961)
-- Name: job_item_container_image_mapping_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item_container_image_mapping
    ADD CONSTRAINT job_item_container_image_mapping_pkey PRIMARY KEY ("jobItemId", "containerImageId");


--
-- TOC entry 3239 (class 2606 OID 256963)
-- Name: job_item_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item
    ADD CONSTRAINT job_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 256965)
-- Name: job_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- TOC entry 3243 (class 2606 OID 256967)
-- Name: token_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY token
    ADD CONSTRAINT token_pkey PRIMARY KEY (id);


--
-- TOC entry 3245 (class 2606 OID 256969)
-- Name: tree_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY tree
    ADD CONSTRAINT tree_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 256971)
-- Name: user_account_company_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company
    ADD CONSTRAINT user_account_company_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 256973)
-- Name: user_account_company_tree_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company_tree
    ADD CONSTRAINT user_account_company_tree_pkey PRIMARY KEY (id);


--
-- TOC entry 3258 (class 2606 OID 256975)
-- Name: user_account_company_tree_userAccountCompanyId_treeId_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company_tree
    ADD CONSTRAINT "user_account_company_tree_userAccountCompanyId_treeId_key" UNIQUE ("userAccountCompanyId", "treeId");


--
-- TOC entry 3254 (class 2606 OID 256977)
-- Name: user_account_company_userAccountId_companyId_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company
    ADD CONSTRAINT "user_account_company_userAccountId_companyId_key" UNIQUE ("userAccountId", "companyId");


--
-- TOC entry 3247 (class 2606 OID 256979)
-- Name: user_account_email_key; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);


--
-- TOC entry 3249 (class 2606 OID 256981)
-- Name: user_account_pkey; Type: CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (id);


SET search_path = audit, pg_catalog;

--
-- TOC entry 3259 (class 1259 OID 257134)
-- Name: logged_action_action_idx; Type: INDEX; Schema: audit; Owner: lambci_test
--

CREATE INDEX logged_action_action_idx ON logged_action USING btree (action);


--
-- TOC entry 3260 (class 1259 OID 257133)
-- Name: logged_action_action_tstamp_tx_stm_idx; Type: INDEX; Schema: audit; Owner: lambci_test
--

CREATE INDEX logged_action_action_tstamp_tx_stm_idx ON logged_action USING btree (action_tstamp_stm);


--
-- TOC entry 3263 (class 1259 OID 257132)
-- Name: logged_action_relid_idx; Type: INDEX; Schema: audit; Owner: lambci_test
--

CREATE INDEX logged_action_relid_idx ON logged_action USING btree (relid);


SET search_path = web, pg_catalog;

--
-- TOC entry 3250 (class 1259 OID 257181)
-- Name: user_account_company_isselected; Type: INDEX; Schema: web; Owner: lambci_test
--

CREATE UNIQUE INDEX user_account_company_isselected ON user_account_company USING btree ("userAccountId", "isSelected") WHERE "isSelected";


--
-- TOC entry 3291 (class 2620 OID 257139)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON company FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3293 (class 2620 OID 257141)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON company_plan FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3295 (class 2620 OID 257143)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3297 (class 2620 OID 257145)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_container_mapping FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3299 (class 2620 OID 257147)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_image FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3301 (class 2620 OID 257149)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_image_container_mapping FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3303 (class 2620 OID 257151)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_image_tag FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3305 (class 2620 OID 257153)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_image_tag_mapping FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3307 (class 2620 OID 257155)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_text FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3309 (class 2620 OID 257157)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_text_container_mapping FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3311 (class 2620 OID 257159)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_video FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3313 (class 2620 OID 257161)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON container_video_container_mapping FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3315 (class 2620 OID 257163)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON download FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3317 (class 2620 OID 257165)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON job FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3319 (class 2620 OID 257167)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON job_item FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3321 (class 2620 OID 257169)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON job_item_container_image_mapping FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3323 (class 2620 OID 257171)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON token FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3325 (class 2620 OID 257173)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON tree FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3327 (class 2620 OID 257175)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON user_account FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3329 (class 2620 OID 257177)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON user_account_company FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3331 (class 2620 OID 257179)
-- Name: audit_trigger_row; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON user_account_company_tree FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3292 (class 2620 OID 257140)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON company FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3294 (class 2620 OID 257142)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON company_plan FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3296 (class 2620 OID 257144)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3298 (class 2620 OID 257146)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_container_mapping FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3300 (class 2620 OID 257148)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_image FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3302 (class 2620 OID 257150)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_image_container_mapping FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3304 (class 2620 OID 257152)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_image_tag FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3306 (class 2620 OID 257154)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_image_tag_mapping FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3308 (class 2620 OID 257156)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_text FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3310 (class 2620 OID 257158)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_text_container_mapping FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3312 (class 2620 OID 257160)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_video FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3314 (class 2620 OID 257162)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON container_video_container_mapping FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3316 (class 2620 OID 257164)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON download FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3318 (class 2620 OID 257166)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON job FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3320 (class 2620 OID 257168)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON job_item FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3322 (class 2620 OID 257170)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON job_item_container_image_mapping FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3324 (class 2620 OID 257172)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON token FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3326 (class 2620 OID 257174)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON tree FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3328 (class 2620 OID 257176)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON user_account FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3330 (class 2620 OID 257178)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON user_account_company FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3332 (class 2620 OID 257180)
-- Name: audit_trigger_stm; Type: TRIGGER; Schema: web; Owner: lambci_test
--

CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON user_account_company_tree FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');


--
-- TOC entry 3264 (class 2606 OID 256982)
-- Name: company_plan_companyId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY company_plan
    ADD CONSTRAINT "company_plan_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3266 (class 2606 OID 256987)
-- Name: container_container_mapping_childContainerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_container_mapping
    ADD CONSTRAINT "container_container_mapping_childContainerId_fkey" FOREIGN KEY ("childContainerId") REFERENCES container(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3267 (class 2606 OID 256992)
-- Name: container_container_mapping_parentContainerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_container_mapping
    ADD CONSTRAINT "container_container_mapping_parentContainerId_fkey" FOREIGN KEY ("parentContainerId") REFERENCES container(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3268 (class 2606 OID 256997)
-- Name: container_image_container_mapping_containerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_container_mapping
    ADD CONSTRAINT "container_image_container_mapping_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES container(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3269 (class 2606 OID 257002)
-- Name: container_image_container_mapping_containerImageId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_container_mapping
    ADD CONSTRAINT "container_image_container_mapping_containerImageId_fkey" FOREIGN KEY ("containerImageId") REFERENCES container_image(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3270 (class 2606 OID 257007)
-- Name: container_image_tag_mapping_containerImageId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag_mapping
    ADD CONSTRAINT "container_image_tag_mapping_containerImageId_fkey" FOREIGN KEY ("containerImageId") REFERENCES container_image(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3271 (class 2606 OID 257012)
-- Name: container_image_tag_mapping_containerImageTagId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_image_tag_mapping
    ADD CONSTRAINT "container_image_tag_mapping_containerImageTagId_fkey" FOREIGN KEY ("containerImageTagId") REFERENCES container_image_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3272 (class 2606 OID 257017)
-- Name: container_text_container_mapping_containerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text_container_mapping
    ADD CONSTRAINT "container_text_container_mapping_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES container(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3273 (class 2606 OID 257022)
-- Name: container_text_container_mapping_containerTextId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_text_container_mapping
    ADD CONSTRAINT "container_text_container_mapping_containerTextId_fkey" FOREIGN KEY ("containerTextId") REFERENCES container_text(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3265 (class 2606 OID 257027)
-- Name: container_treeId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container
    ADD CONSTRAINT "container_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES tree(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3274 (class 2606 OID 257032)
-- Name: container_video_container_mapping_containerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video_container_mapping
    ADD CONSTRAINT "container_video_container_mapping_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES container(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3275 (class 2606 OID 257037)
-- Name: container_video_container_mapping_containerVideoId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY container_video_container_mapping
    ADD CONSTRAINT "container_video_container_mapping_containerVideoId_fkey" FOREIGN KEY ("containerVideoId") REFERENCES container_video(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3276 (class 2606 OID 257042)
-- Name: download_treeId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY download
    ADD CONSTRAINT "download_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES tree(id) ON UPDATE CASCADE;


--
-- TOC entry 3277 (class 2606 OID 257047)
-- Name: download_userAccountId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY download
    ADD CONSTRAINT "download_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES user_account(id) ON UPDATE CASCADE;


--
-- TOC entry 3278 (class 2606 OID 257052)
-- Name: job_assigneeId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job
    ADD CONSTRAINT "job_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES user_account(id) ON UPDATE CASCADE;


--
-- TOC entry 3279 (class 2606 OID 257057)
-- Name: job_companyId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job
    ADD CONSTRAINT "job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE;


--
-- TOC entry 3280 (class 2606 OID 257062)
-- Name: job_creatorId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job
    ADD CONSTRAINT "job_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES user_account(id) ON UPDATE CASCADE;


--
-- TOC entry 3282 (class 2606 OID 257067)
-- Name: job_item_containerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item
    ADD CONSTRAINT "job_item_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES container(id) ON UPDATE CASCADE;


--
-- TOC entry 3284 (class 2606 OID 257072)
-- Name: job_item_container_image_mapping_containerImageId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item_container_image_mapping
    ADD CONSTRAINT "job_item_container_image_mapping_containerImageId_fkey" FOREIGN KEY ("containerImageId") REFERENCES container_image(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 257077)
-- Name: job_item_container_image_mapping_jobItemId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item_container_image_mapping
    ADD CONSTRAINT "job_item_container_image_mapping_jobItemId_fkey" FOREIGN KEY ("jobItemId") REFERENCES job_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3283 (class 2606 OID 257082)
-- Name: job_item_jobId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job_item
    ADD CONSTRAINT "job_item_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3281 (class 2606 OID 257087)
-- Name: job_ownerId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY job
    ADD CONSTRAINT "job_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES user_account(id) ON UPDATE CASCADE;


--
-- TOC entry 3286 (class 2606 OID 257092)
-- Name: tree_companyId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY tree
    ADD CONSTRAINT "tree_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE;


--
-- TOC entry 3287 (class 2606 OID 257097)
-- Name: user_account_company_companyId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company
    ADD CONSTRAINT "user_account_company_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES company(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3289 (class 2606 OID 257102)
-- Name: user_account_company_tree_treeId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company_tree
    ADD CONSTRAINT "user_account_company_tree_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES tree(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3290 (class 2606 OID 257107)
-- Name: user_account_company_tree_userAccountCompanyId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company_tree
    ADD CONSTRAINT "user_account_company_tree_userAccountCompanyId_fkey" FOREIGN KEY ("userAccountCompanyId") REFERENCES user_account_company(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3288 (class 2606 OID 257112)
-- Name: user_account_company_userAccountId_fkey; Type: FK CONSTRAINT; Schema: web; Owner: lambci_test
--

ALTER TABLE ONLY user_account_company
    ADD CONSTRAINT "user_account_company_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES user_account(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 10
-- Name: audit; Type: ACL; Schema: -; Owner: lambci_test
--

REVOKE ALL ON SCHEMA audit FROM PUBLIC;
REVOKE ALL ON SCHEMA audit FROM lambci_test;
GRANT ALL ON SCHEMA audit TO lambci_test;


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 8
-- Name: public; Type: ACL; Schema: -; Owner: lambci_test
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM lambci_test;
GRANT ALL ON SCHEMA public TO lambci_test;
GRANT ALL ON SCHEMA public TO PUBLIC;


SET search_path = audit, pg_catalog;

--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 226
-- Name: logged_action; Type: ACL; Schema: audit; Owner: lambci_test
--

REVOKE ALL ON TABLE logged_action FROM PUBLIC;
REVOKE ALL ON TABLE logged_action FROM lambci_test;
GRANT ALL ON TABLE logged_action TO lambci_test;


-- Completed on 2016-08-19 12:55:19 NZST

--
-- PostgreSQL database dump complete
--

