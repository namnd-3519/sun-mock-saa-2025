// src/domains/hooks/lib/hook-ctx-factory.ts
function buildHookCtx(input) {
  return {
    agent: input.agent,
    cwd: input.cwd,
    serverUrl: input.serverUrl,
    sessionId: input.sessionId,
    event: input.event,
    tkmVersion: input.tkmVersion,
    nodeVersion: input.nodeVersion,
    startedAt: input.startedAt,
    config: input.config,
    hooksConfig: input.config.hooks ?? {},
    runtimeFlags: input.runtimeFlags,
    secretMaskKey: input.secretMaskKey
  };
}
// src/lib/build-config/prod.json
var prod_default = {
  SERVER_URL: "https://takumi.sun-asterisk.ai",
  STATE_DIRNAME: ".takumi",
  EDITION: "cloud",
  TAKUMI_API_URL: "https://agentkit.sun-asterisk.ai",
  OTLP_ALLOWED_DOMAIN: "sun-asterisk.ai"
};

// src/lib/build-config/index.ts
var build = prod_default;
var EDITION = build.EDITION === "enterprise" ? "enterprise" : "cloud";
var SERVER_URL = prod_default.SERVER_URL;
var STATE_DIRNAME = prod_default.STATE_DIRNAME;
var TAKUMI_API_URL = build.TAKUMI_API_URL || undefined;
var OTLP_ALLOWED_DOMAIN = build.OTLP_ALLOWED_DOMAIN || undefined;
var KIT_VERSION = build.KIT_VERSION;

// node_modules/zod/v3/helpers/util.js
var util;
(function(util) {
  util.assertEqual = (_) => {};
  function assertIs(_arg) {}
  util.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util.assertNever = assertNever;
  util.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util.getValidEnumValues = (obj) => {
    const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util.objectValues(filtered);
  };
  util.objectValues = (obj) => {
    return util.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util.joinValues = joinValues;
  util.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil) {
  objectUtil.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === en_default ? undefined : en_default
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil) {
  errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap, invalid_type_error, required_error, description } = params;
  if (errorMap && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap)
    return { errorMap, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result) => {
        return ParseStatus.mergeArray(status, result);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {} else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues) => new ZodError(issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements) {
      const parsedSet = new Set;
      for (const element of elements) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements) => finalizeSet(elements));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result) => {
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {
  ZodFirstPartyTypeKind["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
// src/types/takumi-config.ts
var PlanValidationModeSchema = enumType(["prompt", "auto", "strict", "none"]);
var PlanFocusAreaSchema = enumType([
  "assumptions",
  "risks",
  "tradeoffs",
  "architecture",
  "security",
  "performance",
  "testing",
  "dependencies"
]);
var PlanResolutionOrderSchema = enumType(["session", "branch", "directory"]);
var ProjectTypeSchema = enumType([
  "auto",
  "library",
  "application",
  "monorepo",
  "cli",
  "api",
  "web",
  "mobile"
]);
var PackageManagerSchema = enumType(["auto", "npm", "yarn", "pnpm", "bun"]);
var FrameworkSchema = enumType([
  "auto",
  "react",
  "vue",
  "angular",
  "svelte",
  "nextjs",
  "nuxt",
  "express",
  "nestjs",
  "fastify",
  "none"
]);
var GEMINI_MODEL_VALUES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3-pro-preview",
  "gemini-3-flash-preview"
];
var LEGACY_GEMINI_MODEL_ALIASES = {
  "gemini-3.0-flash": "gemini-3-flash-preview",
  "gemini-3.0-pro": "gemini-3-pro-preview",
  "gemini-3-flash": "gemini-3-flash-preview",
  "gemini-3-pro": "gemini-3-pro-preview"
};
var GeminiModelSchema = enumType(GEMINI_MODEL_VALUES);
var StatuslineModeSchema = enumType(["full", "compact", "minimal", "none"]);
var StatuslineSectionIdSchema = enumType([
  "model",
  "context",
  "quota",
  "directory",
  "git",
  "cost",
  "changes",
  "agents",
  "todos"
]);
var StatuslineSectionConfigSchema = objectType({
  icon: stringType().max(20).optional(),
  label: stringType().max(50).optional(),
  color: stringType().max(30).regex(/^[a-zA-Z]+$/).optional(),
  maxWidth: numberType().int().min(10).max(500).optional()
});
var StatuslineThemeSchema = objectType({
  name: stringType().max(50).optional(),
  contextLow: stringType().max(30).regex(/^[a-zA-Z]+$/).default("green"),
  contextMid: stringType().max(30).regex(/^[a-zA-Z]+$/).default("yellow"),
  contextHigh: stringType().max(30).regex(/^[a-zA-Z]+$/).default("red"),
  accent: stringType().max(30).regex(/^[a-zA-Z]+$/).default("cyan"),
  muted: stringType().max(30).regex(/^[a-zA-Z]+$/).default("dim"),
  separator: stringType().max(30).regex(/^[a-zA-Z]+$/).default("dim")
});
var StatuslineLayoutSchema = objectType({
  baseMode: StatuslineModeSchema.default("full"),
  lines: arrayType(arrayType(StatuslineSectionIdSchema)).max(10).optional(),
  sectionConfig: recordType(stringType(), StatuslineSectionConfigSchema).optional(),
  theme: StatuslineThemeSchema.optional(),
  responsiveBreakpoint: numberType().min(0.5).max(1).default(0.85),
  maxAgentRows: numberType().int().min(1).max(10).default(4),
  todoTruncation: numberType().int().min(20).max(100).default(50)
});
var StatuslineBarStyleSchema = enumType(["geometric", "block"]);
var StatuslineConfigSchema = objectType({
  prompt: stringType().optional(),
  brand: objectType({
    icon: stringType().optional(),
    showCliVersion: booleanType().optional(),
    showCoreVersion: booleanType().optional(),
    color: stringType().optional(),
    versionColor: stringType().optional()
  }).passthrough().optional(),
  model: objectType({ color: stringType().optional() }).passthrough().optional(),
  context: objectType({
    barWidth: numberType().int().optional(),
    barStyle: StatuslineBarStyleSchema.optional(),
    showPercent: booleanType().optional(),
    colors: objectType({ low: stringType(), mid: stringType(), high: stringType() }).partial().passthrough().optional(),
    thresholds: objectType({ mid: numberType(), high: numberType() }).partial().passthrough().optional()
  }).passthrough().optional(),
  quotas: objectType({
    windows: arrayType(stringType()).optional(),
    barWidth: numberType().int().optional(),
    showCountdown: booleanType().optional(),
    icon: stringType().optional()
  }).passthrough().optional(),
  directory: objectType({
    icon: stringType().optional(),
    collapseHome: booleanType().optional(),
    truncationLength: numberType().int().optional(),
    color: stringType().optional()
  }).passthrough().optional(),
  git: objectType({
    icon: stringType().optional(),
    showDirty: booleanType().optional(),
    dirtyInBrackets: booleanType().optional(),
    showAheadBehind: booleanType().optional(),
    countUntracked: booleanType().optional(),
    branchColor: stringType().optional()
  }).passthrough().optional(),
  activity: objectType({
    maxAgentRows: numberType().int().optional(),
    todoTruncation: numberType().int().optional()
  }).passthrough().optional(),
  cost: objectType({ icon: stringType().optional(), hideZero: booleanType().optional() }).passthrough().optional(),
  cache: objectType({
    icon: stringType().optional(),
    warnFraction: numberType().min(0).max(1).optional(),
    showHint: booleanType().optional(),
    showStats: booleanType().optional()
  }).passthrough().optional()
}).passthrough();
var CodingLevelSchema = numberType().int().min(-1).max(5);
var PlanResolutionSchema = objectType({
  order: arrayType(PlanResolutionOrderSchema).optional(),
  branchPattern: stringType().optional()
});
var PlanValidationSchema = objectType({
  mode: PlanValidationModeSchema.optional(),
  minQuestions: numberType().int().min(0).max(20).optional(),
  maxQuestions: numberType().int().min(1).max(20).optional(),
  focusAreas: arrayType(PlanFocusAreaSchema).optional()
});
var SkPlanConfigSchema = objectType({
  namingFormat: stringType().optional(),
  dateFormat: stringType().optional(),
  issuePrefix: stringType().optional(),
  reportsDir: stringType().optional(),
  resolution: PlanResolutionSchema.optional(),
  validation: PlanValidationSchema.optional()
});
var SkDocsConfigSchema = objectType({
  maxLoc: numberType().int().min(100).max(5000).optional()
});
var SkPathsConfigSchema = objectType({
  docs: stringType().optional(),
  outputsDir: stringType().optional(),
  plans: stringType().optional()
});
var SkLocaleConfigSchema = objectType({
  thinkingLanguage: stringType().nullable().optional(),
  responseLanguage: stringType().nullable().optional()
});
var SkTrustConfigSchema = objectType({
  passphrase: stringType().nullable().optional(),
  enabled: booleanType().optional()
});
var SkGraphifyConfigSchema = objectType({
  enabled: booleanType().optional()
});
var SkProjectConfigSchema = objectType({
  type: ProjectTypeSchema.optional(),
  packageManager: PackageManagerSchema.optional(),
  framework: FrameworkSchema.optional()
});
var SkGeminiConfigSchema = objectType({
  model: GeminiModelSchema.optional()
});
var SkSkillsConfigSchema = objectType({
  research: objectType({
    useGemini: booleanType().optional()
  }).passthrough().optional()
}).passthrough();
var SkSkillExtensionsConfigSchema = objectType({
  sharedDir: stringType().optional()
}).passthrough();
var SkTakumiConfigSchema = objectType({
  sddMode: enumType(["ask", "on", "off"]).optional()
}).passthrough();
var SkSubagentAgentConfigSchema = objectType({
  contextPrefix: stringType().optional()
}).passthrough();
var SkSubagentConfigSchema = objectType({
  agents: recordType(stringType(), SkSubagentAgentConfigSchema).optional()
}).passthrough();
var UpdatePipelineSchema = objectType({
  autoInitAfterUpdate: booleanType().default(false)
});
function normalizeGeminiModelValue(value) {
  if (typeof value !== "string") {
    return value;
  }
  const normalized = value.trim().toLowerCase();
  return LEGACY_GEMINI_MODEL_ALIASES[normalized] ?? normalized;
}
function normalizeTakumiConfigInput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const normalized = structuredClone(value);
  const gemini = normalized.gemini;
  if (gemini && typeof gemini === "object" && !Array.isArray(gemini)) {
    const geminiConfig = gemini;
    if ("model" in geminiConfig) {
      geminiConfig.model = normalizeGeminiModelValue(geminiConfig.model);
    }
  }
  return normalized;
}
var ResolvedModelConfigSchema = objectType({
  model: stringType(),
  effort: stringType().optional()
});
var ModelTierMapSchema = objectType({
  flagship: ResolvedModelConfigSchema.optional(),
  heavy: ResolvedModelConfigSchema.optional(),
  balanced: ResolvedModelConfigSchema.optional(),
  light: ResolvedModelConfigSchema.optional()
});
var SkModelTaxonomySchema = recordType(stringType(), ModelTierMapSchema);
var SkAssertionSchema = objectType({
  pattern: stringType().optional(),
  rule: stringType().optional(),
  message: stringType().optional()
});
var SkHooksConfigSchema = objectType({
  "session-init": booleanType().optional(),
  "subagent-init": booleanType().optional(),
  "descriptive-name": booleanType().optional(),
  "dev-rules-reminder": booleanType().optional(),
  "usage-context-awareness": booleanType().optional(),
  "context-tracking": booleanType().optional(),
  "scout-block": booleanType().optional(),
  "privacy-block": booleanType().optional(),
  "post-edit-simplify-reminder": booleanType().optional(),
  "evidence-gate-guard": booleanType().optional(),
  "guard-jailbreak": booleanType().optional(),
  "session-notices": booleanType().optional(),
  "session-state": booleanType().optional(),
  "skill-extension-loader": booleanType().optional(),
  "precompact-guard": booleanType().optional(),
  "secret-redactor": booleanType().optional(),
  "webfetch-cache": booleanType().optional()
});
var TakumiConfigSchema = objectType({
  $schema: stringType().optional(),
  codingLevel: CodingLevelSchema.optional(),
  statusline: unionType([StatuslineModeSchema, StatuslineConfigSchema]).optional(),
  statuslineColors: booleanType().optional(),
  statuslineQuota: booleanType().optional(),
  statuslineLayout: StatuslineLayoutSchema.optional(),
  privacyBlock: booleanType().optional(),
  docs: SkDocsConfigSchema.optional(),
  plan: SkPlanConfigSchema.optional(),
  paths: SkPathsConfigSchema.optional(),
  locale: SkLocaleConfigSchema.optional(),
  trust: SkTrustConfigSchema.optional(),
  graphify: SkGraphifyConfigSchema.optional(),
  project: SkProjectConfigSchema.optional(),
  gemini: SkGeminiConfigSchema.optional(),
  skills: SkSkillsConfigSchema.optional(),
  skillExtensions: SkSkillExtensionsConfigSchema.optional(),
  takumi: SkTakumiConfigSchema.optional(),
  subagent: SkSubagentConfigSchema.optional(),
  assertions: arrayType(SkAssertionSchema).optional(),
  hooks: SkHooksConfigSchema.optional(),
  mods: booleanType().optional(),
  updatePipeline: UpdatePipelineSchema.optional(),
  modelTaxonomy: SkModelTaxonomySchema.optional()
}).passthrough();
var DEFAULT_TAKUMI_CONFIG = {
  codingLevel: -1,
  statusline: "full",
  statuslineColors: true,
  statuslineQuota: true,
  statuslineLayout: undefined,
  privacyBlock: true,
  docs: {
    maxLoc: 800
  },
  plan: {
    namingFormat: "{date}-{issue}-{slug}",
    dateFormat: "YYMMDD-HHmm",
    issuePrefix: "GH-",
    resolution: {
      order: ["session", "branch"],
      branchPattern: "(?:feat|fix|chore|refactor|docs)/(?:[^/]+/)?(.+)"
    },
    validation: {
      mode: "prompt",
      minQuestions: 3,
      maxQuestions: 8,
      focusAreas: ["assumptions", "risks", "tradeoffs", "architecture"]
    }
  },
  paths: {
    docs: "docs",
    outputsDir: ".takumi/outputs"
  },
  locale: {
    thinkingLanguage: null,
    responseLanguage: null
  },
  trust: {
    passphrase: null,
    enabled: false
  },
  graphify: {
    enabled: true
  },
  project: {
    type: "auto",
    packageManager: "auto",
    framework: "auto"
  },
  gemini: {
    model: "gemini-3-flash-preview"
  },
  skills: {
    research: {
      useGemini: true
    }
  },
  skillExtensions: {
    sharedDir: ""
  },
  assertions: [],
  hooks: {
    "session-init": true,
    "subagent-init": true,
    "descriptive-name": true,
    "dev-rules-reminder": true,
    "usage-context-awareness": true,
    "context-tracking": true,
    "scout-block": true,
    "privacy-block": true,
    "post-edit-simplify-reminder": true,
    "evidence-gate-guard": true,
    "guard-jailbreak": true,
    "session-notices": true,
    "session-state": true,
    "skill-extension-loader": true,
    "precompact-guard": true,
    "secret-redactor": true,
    "webfetch-cache": true
  },
  updatePipeline: {
    autoInitAfterUpdate: false
  }
};

// src/domains/hooks/handlers/usage-cache/usage-refresh-policy.ts
var USAGE_CACHE_FILE = "usage-limits.json";
var REFRESH_INTERVAL_TOOL_MS = 300000;
function cacheAgeMsFromTimestamp(timestamp, now) {
  if (typeof timestamp !== "number")
    return Number.POSITIVE_INFINITY;
  return Math.max(0, now - timestamp);
}
function cacheAgeMsFromText(text, now) {
  if (!text)
    return Number.POSITIVE_INFINITY;
  try {
    return cacheAgeMsFromTimestamp(JSON.parse(text)?.timestamp, now);
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}
// src/domains/hooks/mod-bridge/mod-journal.ts
var JOURNAL_VERSION = 1;
var JOURNAL_SEGMENT_CAP = 256;
var CLASSIFY_INPUT_KEYS = ["subagent_type", "agent_type"];
function pickClassifyInput(toolInput) {
  const picked = {};
  for (const key of CLASSIFY_INPUT_KEYS) {
    const value = toolInput[key];
    if (typeof value === "string")
      picked[key] = value;
  }
  return Object.keys(picked).length > 0 ? picked : undefined;
}
function parseJournalSegment(text) {
  try {
    const data = JSON.parse(text);
    if (data?.v !== JOURNAL_VERSION || typeof data.epoch !== "string" || typeof data.segment !== "number" || !Array.isArray(data.events)) {
      return null;
    }
    const events = data.events.filter((e) => !!e && typeof e.seq === "number" && typeof e.ts === "string" && typeof e.tool === "string" && typeof e.toolUseId === "string");
    return { v: JOURNAL_VERSION, epoch: data.epoch, segment: data.segment, events };
  } catch {
    return null;
  }
}
function resumeJournalWriter(newest, highestSegmentOnDisk, newEpoch) {
  if (!newest) {
    const segment = highestSegmentOnDisk === null ? 0 : highestSegmentOnDisk + 1;
    return { epoch: newEpoch(), segment, events: [], nextSeq: 1 };
  }
  const lastSeq = newest.events.reduce((max, e) => Math.max(max, e.seq), 0);
  return {
    epoch: newest.epoch,
    segment: newest.segment,
    events: [...newest.events],
    nextSeq: lastSeq + 1
  };
}
function appendJournalEvent(writer, event) {
  if (writer.events.length >= JOURNAL_SEGMENT_CAP) {
    writer.segment += 1;
    writer.events = [];
  }
  writer.events.push({ seq: writer.nextSeq, ...event });
  writer.nextSeq += 1;
  return {
    v: JOURNAL_VERSION,
    epoch: writer.epoch,
    segment: writer.segment,
    events: writer.events
  };
}
// src/domains/config/takumi-config-merge.ts
var TAKUMI_CONFIG_FILE = "takumi.json";
var LEGACY_TAKUMI_CONFIG_FILE = ".takumi.json";
var DANGEROUS_KEYS = ["__proto__", "constructor", "prototype"];
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (DANGEROUS_KEYS.includes(key))
      continue;
    const sourceVal = source[key];
    const targetVal = result[key];
    if (sourceVal !== null && typeof sourceVal === "object" && !Array.isArray(sourceVal) && targetVal !== null && typeof targetVal === "object" && !Array.isArray(targetVal)) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal;
    }
  }
  return result;
}
function parseTakumiConfigText(text) {
  return TakumiConfigSchema.parse(normalizeTakumiConfigInput(JSON.parse(text)));
}
function resolveGlobalConfigDir(claudeConfigDir, defaultDir) {
  return claudeConfigDir || defaultDir;
}
function mergeTakumiConfigLayers(globalConfig, projectConfig) {
  let merged = { ...DEFAULT_TAKUMI_CONFIG };
  if (globalConfig) {
    merged = deepMerge(merged, globalConfig);
  }
  if (projectConfig) {
    merged = deepMerge(merged, projectConfig);
  }
  return merged;
}

// src/mods/tkm-hooks/load-mod-takumi-config.ts
async function readLayer(io, claudeDir) {
  const preferred = `${claudeDir}/${TAKUMI_CONFIG_FILE}`;
  const legacy = `${claudeDir}/${LEGACY_TAKUMI_CONFIG_FILE}`;
  const path = await io.exists(preferred) ? preferred : await io.exists(legacy) ? legacy : null;
  if (!path)
    return null;
  const text = await io.readText(path);
  if (text === null)
    return null;
  try {
    return parseTakumiConfigText(text);
  } catch {
    return null;
  }
}
async function loadModTakumiConfig(io, home, cwd, claudeConfigDir) {
  const globalDir = resolveGlobalConfigDir(claudeConfigDir, home ? `${home}/.claude` : "");
  const globalConfig = globalDir ? await readLayer(io, globalDir).catch(() => null) : null;
  const projectConfig = cwd ? await readLayer(io, `${cwd}/.claude`).catch(() => null) : null;
  return mergeTakumiConfigLayers(globalConfig, projectConfig);
}
// src/mods/tkm-hooks/post-call-policy.ts
function isAnsweredToolResult(result) {
  if (!result || typeof result !== "object")
    return false;
  const r = result;
  return r.deny === undefined && r.isError !== true;
}
var USAGE_CHECK_INTERVAL_MS = 60000;
function usageRefreshDue(cacheAgeMs) {
  return cacheAgeMs >= REFRESH_INTERVAL_TOOL_MS;
}
var USAGE_CACHE_HOOK_ARGV = [
  "tkm",
  "hook-exec",
  "--hook",
  "perf.usage-cache",
  "--event",
  "post-tool-use",
  "-a",
  "claude"
];
// src/domains/hooks/lib/handler-contract.ts
function isHandlerEnabled(ctx, configKey) {
  return ctx.hooksConfig?.[configKey] !== false;
}
var CATEGORY_VALUES = new Set([
  "guard",
  "session",
  "convention",
  "extension",
  "metrics",
  "perf"
]);
var POLICY_VALUES = new Set(["deny", "context", "record"]);

// src/domains/hooks/handlers/guard-jailbreak/handler.ts
var NO_OP = { status: "no-op", timingMs: 0 };
var ALLOW = { status: "ok", timingMs: 0 };
var SELF_PROTECTED_PATHS = [
  ".claude/settings.json",
  ".claude/settings.local.json",
  ".claude/.tkmignore",
  ".codex/hooks.json",
  ".codex/config.toml"
];
var SELF_PROTECTED_MOD_DIR = /\.claude\/skills\/tkm-hooks(?:$|[/\s"'`;&|)])/;
var DISABLE_MOD_COMMAND = /\bclaude\s+plugins?\s+(?:disable|uninstall|remove)\b[^;&|\n]*\btkm-hooks\b/;
function isSelfProtectedPath(candidate) {
  return SELF_PROTECTED_PATHS.some((protectedPath) => candidate.includes(protectedPath)) || SELF_PROTECTED_MOD_DIR.test(candidate);
}
var EDIT_LIKE_TOOLS = new Set(["edit", "write", "multiedit"]);
var SHELL_LIKE_TOOLS = new Set(["bash", "shell"]);
var PATCH_TOOL = "apply_patch";
var PATCH_FILE_HEADER = /^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gm;
function patchTargets(record) {
  const patch = record.command ?? record.input ?? record.patch;
  if (typeof patch !== "string")
    return [];
  return Array.from(patch.matchAll(PATCH_FILE_HEADER), (m) => m[1].trim());
}
function buildDenyReason(candidate) {
  return `Refusing to modify "${candidate}": this path is one of the kit's own guardrail files (agent settings, an ignore list, or the tkm-hooks mod). Changing it from inside an agent session would disarm the hooks that keep this session safe. If this change is genuinely intended, ask the user to make it manually outside the agent session.`;
}
var guardJailbreak = {
  name: "guard-jailbreak",
  category: "guard",
  policy: "deny",
  events: ["PreToolUse"],
  matchers: { PreToolUse: "Bash|Glob|Grep|Read|Edit|Write|apply_patch" },
  denyOnTimeout: true,
  run(input, ctx) {
    if (!isHandlerEnabled(ctx, "guard-jailbreak")) {
      return NO_OP;
    }
    if (typeof input?.tool_name !== "string" || input.tool_name.length === 0) {
      return ALLOW;
    }
    const toolName = input.tool_name.toLowerCase();
    const isEditLike = EDIT_LIKE_TOOLS.has(toolName);
    const isShellLike = SHELL_LIKE_TOOLS.has(toolName);
    const isPatch = toolName === PATCH_TOOL;
    if (!isEditLike && !isShellLike && !isPatch) {
      return NO_OP;
    }
    const toolInput = input.tool_input;
    if (typeof toolInput !== "object" || toolInput === null) {
      return ALLOW;
    }
    const record = toolInput;
    if (isPatch) {
      const target = patchTargets(record).find(isSelfProtectedPath);
      return target ? { status: "deny", denyReason: buildDenyReason(target), timingMs: 0 } : ALLOW;
    }
    let candidate;
    if (isEditLike) {
      candidate = record.file_path ?? record.path;
    } else {
      candidate = record.command;
    }
    if (typeof candidate !== "string" || candidate.length === 0) {
      return ALLOW;
    }
    if (isSelfProtectedPath(candidate) || isShellLike && DISABLE_MOD_COMMAND.test(candidate)) {
      return { status: "deny", denyReason: buildDenyReason(candidate), timingMs: 0 };
    }
    return ALLOW;
  }
};

// src/domains/hooks/secret-masking/hmac-sha256.ts
var K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var rotr = (x, n) => x >>> n | x << 32 - n;
function sha256(data) {
  const bitLength = data.length * 8;
  const padded = new Uint8Array(Math.ceil((data.length + 9) / 64) * 64);
  padded.set(data);
  padded[data.length] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 2 ** 32));
  view.setUint32(padded.length - 4, bitLength >>> 0);
  const h = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const w = new Uint32Array(64);
  for (let block = 0;block < padded.length; block += 64) {
    for (let i = 0;i < 16; i++)
      w[i] = view.getUint32(block + i * 4);
    for (let i = 16;i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
      w[i] = w[i - 16] + s0 + w[i - 7] + s1;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0;i < 64; i++) {
      const t1 = hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + (e & f ^ ~e & g) + K[i] + w[i] | 0;
      const t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + (a & b ^ a & c ^ b & c) | 0;
      hh = g;
      g = f;
      f = e;
      e = d + t1 | 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 | 0;
    }
    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
    h[5] += f;
    h[6] += g;
    h[7] += hh;
  }
  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0;i < 8; i++)
    outView.setUint32(i * 4, h[i]);
  return out;
}
var BLOCK = 64;
function hmacSha256Hex(key, message) {
  const k = new Uint8Array(BLOCK);
  k.set(key.length > BLOCK ? sha256(key) : key);
  const msg = new TextEncoder().encode(message);
  const inner = new Uint8Array(BLOCK + msg.length);
  const outer = new Uint8Array(BLOCK + 32);
  for (let i = 0;i < BLOCK; i++) {
    inner[i] = k[i] ^ 54;
    outer[i] = k[i] ^ 92;
  }
  inner.set(msg, BLOCK);
  outer.set(sha256(inner), BLOCK);
  let hex = "";
  for (const byte of sha256(outer))
    hex += byte.toString(16).padStart(2, "0");
  return hex;
}

// src/domains/hooks/secret-masking/url-token-patterns.ts
var WEBHOOK = "webhook-url";
var keepPrefix = (place, _match, prefix, secret) => `${prefix}${place(WEBHOOK, secret)}`;
var URL_TOKEN_PATTERNS = [
  {
    kind: "url-password",
    re: /\b([a-z][a-z0-9+.-]{0,31}:\/\/[^\s:@/]{0,256}:)([^\s@/]{1,256})@/gi,
    mask: (place, _m, prefix, password) => `${prefix}${place("url-password", password)}@`,
    accept: (match) => !/:\/\/[^\s:@/]*:(?:\$|\{\{|<|%\()/.test(match)
  },
  {
    kind: WEBHOOK,
    re: /(\bhooks\.slack\.com\/(?:services|workflows|triggers)\/)([A-Za-z0-9_/-]{20,})/g,
    mask: keepPrefix
  },
  {
    kind: WEBHOOK,
    re: /(\bdiscord(?:app)?\.com\/api\/webhooks\/\d{5,}\/)([A-Za-z0-9_-]{30,})/g,
    mask: keepPrefix
  },
  {
    kind: WEBHOOK,
    re: /(\.webhook\.office\.com\/webhookb2\/|\boutlook\.office(?:365)?\.com\/webhook\/)([^\s"'<>`]{20,})/g,
    mask: keepPrefix
  },
  {
    kind: WEBHOOK,
    re: /(\bhooks\.zapier\.com\/hooks\/catch\/\d+\/)([A-Za-z0-9]{4,})/g,
    mask: keepPrefix
  }
];

// src/domains/hooks/secret-masking/secret-token-patterns.ts
var MASK_PREFIX = "[tkm-redacted:";
var BASE64_DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function decodeBase64Head(text, chars = 64) {
  let bits = 0;
  let buffer = 0;
  let out = "";
  for (const c of text.slice(0, chars)) {
    const digit = BASE64_DIGITS.indexOf(c);
    if (digit < 0)
      break;
    buffer = buffer << 6 | digit;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode(buffer >> bits & 255);
    }
  }
  return out;
}
var SECRET_TOKEN_PATTERNS = [
  {
    kind: "private-key",
    re: /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----[\s\S]*?-----END (?:[A-Z0-9]+ )*PRIVATE KEY-----/g
  },
  { kind: "aws-access-key-id", re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { kind: "anthropic-api-key", re: /\bsk-ant-[a-z0-9]+-[A-Za-z0-9_-]{20,}/g },
  { kind: "openrouter-api-key", re: /\bsk-or-v1-[a-f0-9]{64}\b/g },
  { kind: "openai-api-key", re: /\bsk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{32,512}/g },
  { kind: "github-token", re: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})/g },
  { kind: "gitlab-token", re: /\bgl(?:pat|ptt|dt|rt|soat)-[A-Za-z0-9_-]{20,}/g },
  { kind: "slack-token", re: /\b(?:xox[abposr]-[A-Za-z0-9-]{10,}|xapp-\d-[A-Za-z0-9-]{10,})/g },
  {
    kind: "stripe-key",
    re: /\b(?:(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{24,})/g
  },
  { kind: "google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { kind: "google-oauth-client-secret", re: /\bGOCSPX-[A-Za-z0-9_-]{28}\b/g },
  { kind: "npm-token", re: /\bnpm_[A-Za-z0-9]{36}\b/g },
  { kind: "pypi-token", re: /\bpypi-AgEIcHlwaS5vcmc[A-Za-z0-9_-]{50,}/g },
  { kind: "huggingface-token", re: /\bhf_[A-Za-z0-9]{30,}\b/g },
  { kind: "groq-api-key", re: /\bgsk_[A-Za-z0-9]{48,}\b/g },
  { kind: "xai-api-key", re: /\bxai-[A-Za-z0-9]{64,}\b/g },
  { kind: "replicate-token", re: /\br8_[A-Za-z0-9]{36,}\b/g },
  { kind: "shopify-token", re: /\bshp(?:at|ca|pa|ss)_[a-fA-F0-9]{32}\b/g },
  { kind: "digitalocean-token", re: /\bdo[opr]_v1_[a-f0-9]{64}\b/g },
  { kind: "sendgrid-api-key", re: /\bSG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}\b/g },
  { kind: "mailgun-api-key", re: /\bkey-[0-9a-f]{32}\b/g },
  { kind: "twilio-api-key", re: /\bSK[0-9a-f]{32}\b/g },
  { kind: "linear-api-key", re: /\blin_api_[A-Za-z0-9]{40}\b/g },
  { kind: "notion-token", re: /\bntn_[A-Za-z0-9]{40,}\b/g },
  { kind: "figma-token", re: /\bfigd_[A-Za-z0-9_-]{40,}/g },
  { kind: "postman-api-key", re: /\bPMAK-[a-f0-9]{24}-[a-f0-9]{34}\b/g },
  { kind: "sentry-token", re: /\b(?:sntrys_eyJ[A-Za-z0-9+/=_-]{40,}|sntryu_[a-f0-9]{64}\b)/g },
  { kind: "supabase-token", re: /\b(?:sbp_[a-f0-9]{40}\b|sb_secret_[A-Za-z0-9_-]{20,})/g },
  { kind: "planetscale-token", re: /\bpscale_(?:tkn|pw|oauth)_[A-Za-z0-9_-]{32,}/g },
  { kind: "doppler-token", re: /\bdp\.(?:st|pt|sa|ct|scim|audit)\.[A-Za-z0-9_.-]{40,}/g },
  { kind: "databricks-token", re: /\bdapi[a-f0-9]{32}(?:-\d)?\b/g },
  { kind: "atlassian-api-token", re: /\bATATT3[A-Za-z0-9_=-]{150,}/g },
  { kind: "telegram-bot-token", re: /\b\d{8,10}:AA[A-Za-z0-9_-]{33}\b/g },
  {
    kind: "jwt",
    re: /\beyJ[A-Za-z0-9_-]{8,4096}\.eyJ[A-Za-z0-9_-]{8,8192}\.[A-Za-z0-9_-]{8,1024}/g
  },
  {
    kind: "bearer-token",
    re: /\b(Bearer[ \t]+)([A-Za-z0-9._~+/=-]{16,})/g,
    mask: (place, _m, prefix, token) => `${prefix}${place("bearer-token", token)}`
  },
  {
    kind: "private-key",
    re: /\bLS0tLS1CRUdJTi[A-Za-z0-9+/]{40,}={0,2}/g,
    accept: (match) => /^-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/.test(decodeBase64Head(match))
  },
  ...URL_TOKEN_PATTERNS
];
function maskSecretTokens(text, found, place) {
  let out = text;
  for (const { kind, re, mask, accept } of SECRET_TOKEN_PATTERNS) {
    re.lastIndex = 0;
    if (!re.test(out))
      continue;
    re.lastIndex = 0;
    out = out.replace(re, (match, ...groups) => {
      if (accept && !accept(match))
        return match;
      found.add(kind);
      return mask ? mask(place, match, ...groups) : place(kind, match);
    });
  }
  return out;
}

// src/domains/hooks/secret-masking/placeholder-signature.ts
var PART_LENGTH = 6;
var SIGNED_PLACEHOLDER_RE = /\[tkm-redacted:([a-z0-9-]{1,40}):([0-9a-f]{6})\.([0-9a-f]{6})\]/g;
var mac = (key, kind, tag) => hmacSha256Hex(key, `mac:${kind}:${tag}`).slice(0, PART_LENGTH);
function placeholderMaker(key) {
  if (!key)
    return (kind) => `${MASK_PREFIX}${kind}]`;
  return (kind, value) => {
    const tag = hmacSha256Hex(key, `tag:${value}`).slice(0, PART_LENGTH);
    return `${MASK_PREFIX}${kind}:${tag}.${mac(key, kind, tag)}]`;
  };
}
function countSignedPlaceholders(key, text) {
  if (!key || !text.includes(MASK_PREFIX))
    return 0;
  let count = 0;
  for (const [, kind, tag, sig] of text.matchAll(SIGNED_PLACEHOLDER_RE)) {
    if (mac(key, kind, tag) === sig)
      count++;
  }
  return count;
}
function parseMaskKey(text) {
  const hex = text?.trim() ?? "";
  if (!/^[0-9a-f]{64}$/.test(hex))
    return null;
  const key = new Uint8Array(32);
  for (let i = 0;i < 32; i++)
    key[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return key;
}
var MASK_KEY_FILE = "secret-mask.key";

// src/domains/hooks/secret-masking/secret-assignment-mask.ts
var ASSIGNMENT_KIND = "secret-assignment";
var CREDENTIAL_SEGMENTS = new Set([
  "apikey",
  "auth",
  "credential",
  "credentials",
  "dsn",
  "key",
  "pass",
  "passphrase",
  "passwd",
  "password",
  "pwd",
  "salt",
  "secret",
  "token"
]);
var CREDENTIAL_ENDINGS = ["apikey", "auth", "passwd", "password", "secret", "token"];
var SECRET_SEGMENTS = new Set(["secret", "secrets"]);
var NON_SECRET_SEGMENTS = new Set([
  "continuation",
  "cursor",
  "next",
  "page",
  "public",
  "publishable"
]);
var IDENTIFIER_WORDS = new Set(["auth", "key", "pass", "pwd", "token"]);
var IDENTIFIER_MIN_LENGTH = 20;
var SECRET_MIN_LENGTH = 8;
var ASSIGNMENT_RE = /(?<![\w.$]|[\w.$]-)(\\?["']?)([A-Za-z_][\w.-]*)(\1[ \t]*[=:][ \t]*)(\\"[^"\\\n]*\\"|"[^"\n]*"|'[^'\n]*'|[^\s,;}\]]+)/g;
var FILE_PATH_RE = /\.[A-Za-z][A-Za-z0-9]{1,4}$/;
var MEMBER_ACCESS_RE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+$/;
var PLACEHOLDER_VALUE_RE = /^(?:x{3,}|\*{3,}|changeme|change[-_]me|dummy\w*|example\w*|placeholder\w*|your[-_]\w*|redacted\w*|todo\w*)$/i;
function nameSegments(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").split(/[_.-]+/).filter(Boolean).map((s) => s.toLowerCase());
}
function credentialMinLength(name) {
  const segments = nameSegments(name);
  const last = segments[segments.length - 1];
  if (!last || segments.some((s) => NON_SECRET_SEGMENTS.has(s)))
    return null;
  const credential = segments.some((s) => SECRET_SEGMENTS.has(s)) || CREDENTIAL_SEGMENTS.has(last) || CREDENTIAL_ENDINGS.some((ending) => last.endsWith(ending));
  if (!credential)
    return null;
  if (segments.length === 1 && IDENTIFIER_WORDS.has(last))
    return IDENTIFIER_MIN_LENGTH;
  return SECRET_MIN_LENGTH;
}
function isLiteralSecretValue(value, minLength = SECRET_MIN_LENGTH) {
  if (value.length < minLength || /\s/.test(value))
    return false;
  if (value.startsWith(MASK_PREFIX))
    return false;
  if (/^[$&*!%<{([]/.test(value))
    return false;
  if (/[():\\]/.test(value) || /^(?:\.{0,2}\/|~\/)/.test(value) || FILE_PATH_RE.test(value)) {
    return false;
  }
  if (MEMBER_ACCESS_RE.test(value) || PLACEHOLDER_VALUE_RE.test(value))
    return false;
  return /[0-9]/.test(value) && /[A-Za-z]/.test(value);
}
function unquote(value) {
  for (const q of ["\\\"", '"', "'"]) {
    if (value.length >= 2 * q.length && value.startsWith(q) && value.endsWith(q)) {
      return { quote: q, inner: value.slice(q.length, -q.length) };
    }
  }
  return { quote: "", inner: value };
}
function maskSecretAssignments(text, found, place) {
  ASSIGNMENT_RE.lastIndex = 0;
  return text.replace(ASSIGNMENT_RE, (match, keyQuote, name, sep, value) => {
    const minLength = credentialMinLength(name);
    if (minLength === null)
      return match;
    const { quote, inner } = unquote(value);
    if (!isLiteralSecretValue(inner, minLength))
      return match;
    found.add(ASSIGNMENT_KIND);
    return `${keyQuote}${name}${sep}${quote}${place(ASSIGNMENT_KIND, inner)}${quote}`;
  });
}
var STRUCTURAL_VALUE_RE = /^(?:true|false|null|yes|no|on|off|-?\d+(?:\.\d+)?|[{[].*)$/i;
function maskAllAssignments(text, found, place) {
  ASSIGNMENT_RE.lastIndex = 0;
  return text.replace(ASSIGNMENT_RE, (match, keyQuote, name, sep, value) => {
    const { quote, inner } = unquote(value);
    if (!inner || inner.startsWith(MASK_PREFIX) || STRUCTURAL_VALUE_RE.test(inner))
      return match;
    found.add(ASSIGNMENT_KIND);
    return `${keyQuote}${name}${sep}${quote}${place(ASSIGNMENT_KIND, inner)}${quote}`;
  });
}

// src/domains/hooks/secret-masking/secret-files.ts
var WHOLE_FILE_RES = [
  /(^|\/)\.(htpasswd|pgpass|netrc|git-credentials|vault-token)$/i,
  /\.(pem|key|p8|ppk|p12|pfx|jks)$/i,
  /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/i
];
var VALUES_FILE_RES = [
  /(^|\/)([\w.-]*-)?credentials(\.json)?$/i,
  /(^|\/)\.pypirc$/i,
  /(^|\/)secrets?\.(ya?ml|json|toml)$/i
];
var TEMPLATE_RE = /(^|[._-])(example|sample|template|dist)([._-]|$)/i;
function secretFileMode(path) {
  const normalized = path.replace(/\\/g, "/").replace(/\/+$/, "");
  const base = normalized.slice(normalized.lastIndexOf("/") + 1);
  if (!base || TEMPLATE_RE.test(base))
    return null;
  if (WHOLE_FILE_RES.some((re) => re.test(normalized)))
    return "whole";
  if (VALUES_FILE_RES.some((re) => re.test(normalized)))
    return "values";
  return null;
}
var strongest = (a, b) => a === "whole" || b === "whole" ? "whole" : a ?? b;
var READER_RE = /(^|[\s;&|(`$])(cat|bat|batcat|head|tail|less|more|sed|awk|grep|rg|ag|cut|sort|uniq|strings|xxd|od|hexdump|base64|jq|yq|tac|nl|fold|tr|type|Get-Content|gc)(?=[\s|;&)]|$)/;
function outputFileMode(tool, input) {
  if (tool === "Read" && typeof input.file_path === "string")
    return secretFileMode(input.file_path);
  if (tool !== "Bash" || typeof input.command !== "string")
    return null;
  const command = input.command;
  if (!READER_RE.test(command))
    return null;
  let mode = null;
  for (const word of command.split(/[\s;&|<>()`'"=]+/)) {
    if (word)
      mode = strongest(mode, secretFileMode(word));
    if (mode === "whole")
      break;
  }
  return mode;
}
function hasPathPrefixedLines(tool) {
  return tool === "Grep" || tool === "Bash";
}
var PATH_LINE_RE = /^([^\s:]+):(?:(\d+)[:-])?(.*)$/;
function secretFileLine(line) {
  const match = PATH_LINE_RE.exec(line);
  if (!match)
    return null;
  const mode = secretFileMode(match[1]);
  if (!mode)
    return null;
  const prefix = line.slice(0, line.length - match[3].length);
  return { prefix, text: match[3], mode };
}

// src/domains/hooks/secret-masking/url-query-mask.ts
var KIND = "url-query-secret";
var SIGNATURE_PARAMS = new Set([
  "sig",
  "signature",
  "x-amz-credential",
  "x-amz-security-token",
  "x-amz-signature",
  "x-goog-credential",
  "x-goog-signature"
]);
var QUERY_PARAM_RE = /([?&])([A-Za-z_][\w.-]{0,63})=([^&#\s"'<>`]{1,4096})/g;
function shouldMask(name, value) {
  if (value.startsWith(MASK_PREFIX))
    return false;
  if (SIGNATURE_PARAMS.has(name.toLowerCase()))
    return value.length >= 8;
  const minLength = credentialMinLength(name);
  if (minLength === null)
    return false;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {}
  return isLiteralSecretValue(decoded, minLength);
}
function maskUrlQuerySecrets(text, found, place) {
  if (!text.includes("=") || !(text.includes("?") || text.includes("&")))
    return text;
  QUERY_PARAM_RE.lastIndex = 0;
  return text.replace(QUERY_PARAM_RE, (match, sep, name, value) => {
    if (!shouldMask(name, value))
      return match;
    found.add(KIND);
    return `${sep}${name}=${place(KIND, value)}`;
  });
}

// src/domains/hooks/secret-masking/mask-secrets.ts
var SECRET_FILE_KIND = "secret-file";
var CONTENT_KEYS = new Set([
  "content",
  "output",
  "stderr",
  "stdout",
  "text"
]);
var MAX_DEPTH = 64;
var SKIPPED_KEYS = new Set(["base64"]);
function maskAsFile(text, mode, run) {
  if (mode === "values")
    return maskAllAssignments(text, run.found, run.place);
  if (!text.trim() || text.startsWith(MASK_PREFIX))
    return text;
  run.found.add(SECRET_FILE_KIND);
  return run.place(SECRET_FILE_KIND, text);
}
function maskSecretFileLines(text, run) {
  if (!text.includes(":"))
    return text;
  return text.split(`
`).map((line) => {
    const hit = secretFileLine(line);
    return hit ? hit.prefix + maskAsFile(hit.text, hit.mode, run) : line;
  }).join(`
`);
}
function hasSecretFileLines(text) {
  return text.includes(":") && text.split(`
`).some((line) => secretFileLine(line) !== null);
}
function maskText(text, run, isContent) {
  const fileMode = isContent && !(run.fileLines && run.fileMode && hasSecretFileLines(text)) ? run.fileMode : null;
  if (fileMode === "whole")
    return maskAsFile(text, fileMode, run);
  let out = maskSecretTokens(text, run.found, run.place);
  out = maskUrlQuerySecrets(out, run.found, run.place);
  out = fileMode ? maskAsFile(out, fileMode, run) : maskSecretAssignments(out, run.found, run.place);
  return run.fileLines && !fileMode ? maskSecretFileLines(out, run) : out;
}
function maskNode(node, run, depth, key) {
  if (typeof node === "string")
    return maskText(node, run, key === undefined || CONTENT_KEYS.has(key));
  if (depth >= MAX_DEPTH || node === null || typeof node !== "object")
    return node;
  if (Array.isArray(node))
    return node.map((item) => maskNode(item, run, depth + 1, key));
  const copy = {};
  for (const [k, value] of Object.entries(node)) {
    copy[k] = SKIPPED_KEYS.has(k) ? value : maskNode(value, run, depth + 1, k);
  }
  return copy;
}
function lazyPlaceholder(keySource) {
  let place = null;
  return (kind, value) => {
    place ??= placeholderMaker(keySource?.() ?? null);
    return place(kind, value);
  };
}
function maskSecrets(value, keySource, call) {
  const run = {
    found: new Set,
    place: lazyPlaceholder(keySource),
    fileMode: call ? outputFileMode(call.tool, call.input) : null,
    fileLines: call ? hasPathPrefixedLines(call.tool) : false
  };
  const masked = maskNode(value, run, 0);
  return { value: masked, kinds: [...run.found] };
}
function findSecretTokenKinds(text) {
  const found = new Set;
  maskSecretTokens(text, found, () => "");
  return [...found];
}
function maskingNotice(kinds) {
  return [
    `takumi masked ${kinds.join(", ")} in this result as ${MASK_PREFIX}*]. The real value is not available to you;`,
    "placeholders with the same suffix hide the same value.",
    "If a command needs it, pass it by reference (an environment variable, or the file itself) instead of pasting it.",
    "Never write a placeholder into a file: edit only the lines you need to change.",
    `If you must see the value, ask the user first; once they agree, run the command again with \`${SHOW_SECRETS_MARKER}\` as its first line, and its output is not masked.`
  ].join(" ");
}
var SHOW_SECRETS_MARKER = "# tkm:show-secrets";
function asksToShowSecrets(tool, input) {
  if (tool !== "Bash")
    return false;
  const command = input.command;
  if (typeof command !== "string")
    return false;
  return command.trimStart().split(`
`, 1)[0].trim() === SHOW_SECRETS_MARKER;
}

// src/domains/hooks/handlers/guard-secret-mask/handler.ts
var CONFIG_KEY = "secret-redactor";
var WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "Bash"]);
var OK2 = { status: "ok", timingMs: 0 };
var NO_OP2 = { status: "no-op", timingMs: 0 };
function toRecord(value) {
  return value && typeof value === "object" ? value : {};
}
var text = (value) => typeof value === "string" ? value : "";
function writtenText(toolName, toolInput) {
  if (toolName === "Write")
    return [{ added: toolInput.content }];
  if (toolName === "Bash")
    return [{ added: toolInput.command }];
  const edits = toolName === "MultiEdit" && Array.isArray(toolInput.edits) ? toolInput.edits : [toolInput];
  return edits.map(toRecord).map((edit) => ({ added: edit.new_string, kept: edit.old_string }));
}
function addedPlaceholders(toolName, toolInput, ctx) {
  const fields = writtenText(toolName, toolInput);
  if (!fields.some((f) => text(f.added).includes(MASK_PREFIX)))
    return 0;
  const key = ctx.secretMaskKey?.() ?? null;
  let added = 0;
  for (const f of fields) {
    added += countSignedPlaceholders(key, text(f.added)) - countSignedPlaceholders(key, text(f.kept));
  }
  return added;
}
function checkWrite(toolName, toolInput, ctx) {
  if (!WRITE_TOOLS.has(toolName))
    return NO_OP2;
  if (addedPlaceholders(toolName, toolInput, ctx) <= 0)
    return OK2;
  const target = typeof toolInput.file_path === "string" ? `This write to "${toolInput.file_path}"` : "This command";
  return {
    status: "deny",
    denyReason: [
      `${target} contains a masked value (${MASK_PREFIX}*]) and would replace the real secret on disk with the placeholder.`,
      "Edit only the lines you need to change, leaving masked lines out of the edit, or move the value through the shell (an environment variable) without reading it."
    ].join(" "),
    timingMs: 0
  };
}
function warnFailure(error) {
  if (typeof error !== "string")
    return NO_OP2;
  const { kinds } = maskSecrets(error);
  if (kinds.length === 0)
    return OK2;
  return {
    status: "context",
    output: `This error output contains what looks like a ${kinds.join(", ")}. Do not repeat it, write it to a file, log it or put it in a command.`,
    timingMs: 0
  };
}
function maskResult(input, ctx) {
  const toolName = typeof input.tool_name === "string" ? input.tool_name : "";
  if (input.tool_response === undefined)
    return NO_OP2;
  if (asksToShowSecrets(toolName, toRecord(input.tool_input)))
    return OK2;
  const { value, kinds } = maskSecrets(input.tool_response, ctx.secretMaskKey, {
    tool: toolName,
    input: toRecord(input.tool_input)
  });
  if (kinds.length === 0)
    return OK2;
  return { status: "context", output: maskingNotice(kinds), updatedToolOutput: value, timingMs: 0 };
}
function warnPrompt(prompt) {
  if (typeof prompt !== "string")
    return NO_OP2;
  const kinds = findSecretTokenKinds(prompt);
  if (kinds.length === 0)
    return OK2;
  return {
    status: "context",
    output: `The user's prompt contains what looks like a ${kinds.join(", ")}. Do not repeat it, write it to a file, log it or put it in a command; refer to it by name instead.`,
    timingMs: 0
  };
}
var guardSecretMask = {
  name: "guard-secret-mask",
  category: "guard",
  policy: "deny",
  events: ["PreToolUse", "PostToolUse", "PostToolUseFailure", "UserPromptSubmit"],
  matchers: { PreToolUse: "Bash|Edit|MultiEdit|Write" },
  run(input, ctx) {
    try {
      if (!isHandlerEnabled(ctx, CONFIG_KEY))
        return OK2;
      const event = input?.hook_event_name ?? ctx.event;
      if (event === "PreToolUse") {
        const toolName = typeof input.tool_name === "string" ? input.tool_name : "";
        return checkWrite(toolName, toRecord(input.tool_input), ctx);
      }
      if (event === "PostToolUse")
        return maskResult(input, ctx);
      if (event === "PostToolUseFailure") {
        if (asksToShowSecrets(String(input.tool_name ?? ""), toRecord(input.tool_input)))
          return OK2;
        return warnFailure(input.error);
      }
      if (event === "UserPromptSubmit") {
        ctx.secretMaskKey?.();
        return warnPrompt(input.prompt);
      }
      return NO_OP2;
    } catch {
      return OK2;
    }
  }
};

// src/mods/tkm-hooks/run-guards.ts
var MOD_GUARDS = [guardJailbreak, guardSecretMask];
var MOD_GUARDED_TOOLS = new Set([
  "Read",
  "Grep",
  "Glob",
  "Write",
  "Edit",
  "MultiEdit",
  "Bash"
]);
function decideGuards(tool, toolInput, ctx) {
  const input = { hook_event_name: "PreToolUse", tool_name: tool, tool_input: toolInput };
  for (const guard of MOD_GUARDS) {
    const result = guard.run(input, ctx);
    if (result.status === "deny")
      return result.denyReason ?? `Blocked by ${guard.name}.`;
  }
  return null;
}
function shouldMarkCall(tool) {
  return tool.length > 0 && tool !== "Skill";
}
// src/mods/tkm-hooks/secret-redaction.ts
var errorText = (result) => typeof result === "string" ? result : JSON.stringify(result, null, 2) ?? "";
function maskToolOutcome(outcome, keySource, call, mask = maskSecrets) {
  try {
    if (!outcome || typeof outcome !== "object" || !("result" in outcome))
      return outcome;
    const o = outcome;
    const { value, kinds } = mask(o.result, keySource, call);
    if (kinds.length === 0)
      return outcome;
    if (o.isError === true) {
      return { deny: `${errorText(value)}

${maskingNotice(kinds)}` };
    }
    const context = Array.isArray(o.context) ? o.context : [];
    return { ...o, result: value, context: [...context, maskingNotice(kinds)] };
  } catch {
    return outcome;
  }
}
// src/mods/tkm-hooks/webfetch-cache.ts
var WEBFETCH_CACHE_TTL_MS = 15 * 60000;
var WEBFETCH_CACHE_MAX_ENTRIES = 100;
function webFetchCacheKey(input) {
  const { url, prompt, offset } = input;
  if (typeof url !== "string" || url.length === 0)
    return null;
  const page = typeof offset === "number" ? offset : 0;
  return `${url}
${typeof prompt === "string" ? prompt : ""}
${page}`;
}
function createWebFetchCache(ttlMs = WEBFETCH_CACHE_TTL_MS, maxEntries = WEBFETCH_CACHE_MAX_ENTRIES) {
  const entries = new Map;
  return {
    lookup(input, now) {
      const key = webFetchCacheKey(input);
      const entry = key === null ? undefined : entries.get(key);
      if (!entry || key === null)
        return null;
      const ageMs = now - entry.storedAt;
      if (ageMs >= ttlMs || ageMs < 0) {
        entries.delete(key);
        return null;
      }
      return { result: entry.result, ageMs };
    },
    store(input, result, now) {
      const key = webFetchCacheKey(input);
      if (key === null)
        return;
      entries.delete(key);
      while (entries.size >= maxEntries) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined)
          break;
        entries.delete(oldest);
      }
      entries.set(key, { result, storedAt: now });
    }
  };
}
function webFetchCacheNotice(ageMs) {
  const seconds = Math.max(0, Math.round(ageMs / 1000));
  return `takumi answered this WebFetch from a ${seconds}s-old session cache for the same URL, prompt and offset; nothing was fetched again. Fetch with a different prompt if you need a fresh copy.`;
}
// src/mods/tkm-hooks/tool-call-input.ts
function splitToolCall(e) {
  const { tool, tool_use_id, consent: _consent, agentId, ...toolInput } = e;
  return {
    tool: typeof tool === "string" ? tool : "",
    toolUseId: typeof tool_use_id === "string" ? tool_use_id : null,
    toolInput,
    agentId: typeof agentId === "string" && agentId.length > 0 ? agentId : null
  };
}
// src/domains/hooks/handlers/convention-quality-gate/guardrail-config.ts
var QUALITY_GATE_HANDLER_NAME = "convention-quality-gate";
var DEFAULT_DEBOUNCE_MS = 5000;
var MIN_DEBOUNCE_MS = 0;
var MAX_DEBOUNCE_MS = 300000;
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}
function asCommand(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
function readGuardrailConfig(config) {
  const guardrail = asRecord(asRecord(asRecord(config)?.hooks)?.guardrail);
  if (!guardrail || guardrail.enabled !== true) {
    return null;
  }
  let debounceMs = DEFAULT_DEBOUNCE_MS;
  const rawDebounce = guardrail.debounceMs;
  if (typeof rawDebounce === "number" && Number.isFinite(rawDebounce)) {
    debounceMs = Math.min(MAX_DEBOUNCE_MS, Math.max(MIN_DEBOUNCE_MS, rawDebounce));
  }
  const checks = asRecord(guardrail.checks) ?? {};
  return {
    debounceMs,
    checks: {
      typecheck: asCommand(checks.typecheck),
      lint: asCommand(checks.lint),
      test: asCommand(checks.test)
    }
  };
}

// src/domains/hooks/lib/hook-matcher.ts
var MATCH_FIELD_BY_EVENT = {
  PreToolUse: "tool_name",
  PostToolUse: "tool_name",
  PostToolUseFailure: "tool_name",
  PermissionRequest: "tool_name",
  SessionStart: "source",
  SessionEnd: "reason",
  SubagentStart: "agent_type",
  SubagentStop: "agent_type",
  PreCompact: "trigger",
  Notification: "notification_type"
};
var EXACT_LIST = /^[A-Za-z0-9_|]+$/;
var MATCH_ALIASES = new Map([
  ["apply_patch", ["apply_patch", "Edit", "Write"]]
]);
function isMatchAll(matcher) {
  return matcher === undefined || matcher === "" || matcher === "*";
}
function hookMatcherAccepts(matcher, event, input) {
  if (isMatchAll(matcher))
    return true;
  const field = MATCH_FIELD_BY_EVENT[event];
  if (!field)
    return true;
  const value = input[field];
  if (typeof value !== "string" || value === "")
    return true;
  const pattern = matcher;
  const names = MATCH_ALIASES.get(value) ?? [value];
  if (EXACT_LIST.test(pattern)) {
    const listed = pattern.split("|");
    return names.some((name) => listed.includes(name));
  }
  try {
    const re = new RegExp(`^(?:${pattern})$`);
    return names.some((name) => re.test(name));
  } catch {
    return true;
  }
}

// src/domains/hooks/lib/hook-prescreen.ts
var PRESCREEN_FIELDS = [
  "tool_input.command",
  "tool_input.file_path",
  "tool_input.path",
  "prompt"
];
var PRESCREEN_FILE_VERSION = 1;
var PLUGIN_PRESCREEN_PATH = ".tkm/prescreen.json";
var PROMPT_PRESCREEN_FILE = "prompt-prescreen.json";
var MAX_PATTERN_LENGTH = 2000;
function compile(source) {
  try {
    return new RegExp(source, "i");
  } catch {
    return null;
  }
}
function validatePrescreen(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return;
  const out = {};
  for (const field of PRESCREEN_FIELDS) {
    const value = raw[field];
    if (typeof value !== "string" || value.length === 0 || value.length > MAX_PATTERN_LENGTH) {
      continue;
    }
    if (compile(value))
      out[field] = value;
  }
  const known = new Set(PRESCREEN_FIELDS);
  if (Object.keys(raw).some((key) => !known.has(key)))
    return;
  return Object.keys(out).length > 0 ? out : undefined;
}
function parsePrescreenFile(text) {
  if (!text)
    return [];
  try {
    const data = JSON.parse(text);
    if (data.version !== PRESCREEN_FILE_VERSION || !Array.isArray(data.hooks))
      return [];
    const entries = [];
    for (const hook of data.hooks) {
      const prescreen = validatePrescreen(hook?.prescreen);
      const events = Array.isArray(hook?.events) ? hook.events.filter((e) => typeof e === "string") : [];
      if (typeof hook?.name !== "string" || !prescreen || events.length === 0)
        continue;
      const matchers = hook.matchers && typeof hook.matchers === "object" ? hook.matchers : undefined;
      entries.push({ name: hook.name, events, prescreen, ...matchers ? { matchers } : {} });
    }
    return entries;
  } catch {
    return [];
  }
}
function fieldValue(toolInput, field) {
  const value = toolInput[field.slice("tool_input.".length)];
  return typeof value === "string" ? value : "";
}
function entryMayAct(entry, call) {
  for (const [field, source] of Object.entries(entry.prescreen)) {
    if (field === "prompt") {
      const flag = call.subagent ? undefined : call.promptFlags?.[entry.name];
      if (flag !== false)
        return true;
      continue;
    }
    const re = compile(source);
    if (!re || re.test(fieldValue(call.toolInput, field)))
      return true;
  }
  return false;
}
var TOOL_EVENTS = ["PreToolUse", "PostToolUse"];
function prescreenSkips(entries, call) {
  const verdicts = new Map;
  for (const event of TOOL_EVENTS) {
    const input = { hook_event_name: event, tool_name: call.tool };
    for (const entry of entries) {
      if (!entry.events.includes(event))
        continue;
      if (!hookMatcherAccepts(entry.matchers?.[event], event, input))
        continue;
      const skip = !entryMayAct(entry, call);
      verdicts.set(entry.name, (verdicts.get(entry.name) ?? true) && skip);
    }
  }
  return [...verdicts].filter(([, skip]) => skip).map(([name]) => name);
}
function prescreenFilePaths(cwd, globalClaudeDir) {
  const paths = [];
  if (cwd)
    paths.push(`${cwd}/.claude/skills/tkm/${PLUGIN_PRESCREEN_PATH}`);
  if (globalClaudeDir)
    paths.push(`${globalClaudeDir}/skills/tkm/${PLUGIN_PRESCREEN_PATH}`);
  return paths;
}
function mergePrescreenFiles(texts) {
  return texts.flatMap((text) => parsePrescreenFile(text));
}
function promptFlagsPath(sessionDir) {
  return `${sessionDir}/${PROMPT_PRESCREEN_FILE}`;
}

// src/domains/hooks/mod-bridge/mod-session-paths.ts
var MOD_SESSIONS_DIRNAME = "mod-sessions";
var MOD_CALLS_DIRNAME = "calls";
var MOD_JOURNAL_PREFIX = "journal-";
var SAFE_SEGMENT = /^[A-Za-z0-9_-][A-Za-z0-9._-]{0,127}$/;
function safeModSegment(value) {
  return typeof value === "string" && SAFE_SEGMENT.test(value) ? value : null;
}
function resolveModConfigDir(args) {
  if (args.takumiHome && args.takumiHome.trim().length > 0)
    return args.takumiHome;
  if (!args.home)
    return null;
  return `${args.home}/${args.stateDirname}`;
}
function modSessionDir(configDir, sessionId) {
  const segment = safeModSegment(sessionId);
  return segment ? `${configDir}/${MOD_SESSIONS_DIRNAME}/${segment}` : null;
}
function modCallMarkerPath(configDir, sessionId, toolUseId) {
  const dir = modSessionDir(configDir, sessionId);
  const call = safeModSegment(toolUseId);
  return dir && call ? `${dir}/${MOD_CALLS_DIRNAME}/${call}` : null;
}
function modJournalSegmentName(segment) {
  return `${MOD_JOURNAL_PREFIX}${segment}.json`;
}
function parseModJournalSegment(name) {
  const match = /^journal-(\d{1,6})\.json$/.exec(name);
  return match ? Number(match[1]) : null;
}

// src/domains/hooks/mod-install/mod-shim-command.ts
function modSkipMarkerSuffix(skipKey) {
  return `.skip-${skipKey}`;
}

// src/mods/tkm-hooks/prescreen-skips.ts
var QUALITY_GATE_TOOLS = new Set(["Edit", "Write", "MultiEdit"]);
function parsePromptFlags(text) {
  if (!text)
    return null;
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data))
      return null;
    const flags = {};
    for (const [name, value] of Object.entries(data)) {
      if (typeof value === "boolean")
        flags[name] = value;
    }
    return flags;
  } catch {
    return null;
  }
}
function decideHookSkips(input) {
  const names = prescreenSkips(input.entries, input);
  if (QUALITY_GATE_TOOLS.has(input.tool) && readGuardrailConfig(input.config) === null) {
    names.push(QUALITY_GATE_HANDLER_NAME);
  }
  return names;
}
function skipMarkerPaths(configDir, sessionId, toolUseId, names) {
  const base = modCallMarkerPath(configDir, sessionId, toolUseId);
  return base ? names.map((name) => `${base}${modSkipMarkerSuffix(name)}`) : [];
}

// src/mods/tkm-hooks/core-entry.ts
var MOD_STATE_DIRNAME = STATE_DIRNAME;
var MOD_VERSION = "26.11.2";
function buildGuardCtx(args) {
  return buildHookCtx({
    agent: "claude",
    cwd: args.cwd,
    serverUrl: null,
    sessionId: args.sessionId,
    event: "PreToolUse",
    tkmVersion: MOD_VERSION,
    nodeVersion: "",
    startedAt: new Date().toISOString(),
    config: args.config ?? DEFAULT_TAKUMI_CONFIG,
    secretMaskKey: () => args.secretMaskKey ?? null
  });
}
export {
  MASK_KEY_FILE,
  MOD_GUARDED_TOOLS,
  MOD_STATE_DIRNAME,
  MOD_VERSION,
  USAGE_CACHE_FILE,
  USAGE_CACHE_HOOK_ARGV,
  USAGE_CHECK_INTERVAL_MS,
  appendJournalEvent,
  asksToShowSecrets,
  buildGuardCtx,
  cacheAgeMsFromText,
  createWebFetchCache,
  decideGuards,
  decideHookSkips,
  isAnsweredToolResult,
  loadModTakumiConfig,
  maskToolOutcome,
  mergePrescreenFiles,
  modCallMarkerPath,
  modJournalSegmentName,
  modSessionDir,
  parseJournalSegment,
  parseMaskKey,
  parseModJournalSegment,
  parsePromptFlags,
  pickClassifyInput,
  prescreenFilePaths,
  promptFlagsPath,
  resolveGlobalConfigDir,
  resolveModConfigDir,
  resumeJournalWriter,
  safeModSegment,
  shouldMarkCall,
  skipMarkerPaths,
  splitToolCall,
  usageRefreshDue,
  webFetchCacheNotice
};
