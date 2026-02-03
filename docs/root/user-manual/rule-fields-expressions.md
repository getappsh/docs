# Rule Fields and Expressions

This guide provides a comprehensive reference for building rule expressions used in both policies and restrictions.

## Overview

Rules are built using **fields**, **operators**, and **values**. The rule engine evaluates these expressions to determine whether a policy or restriction matches.

**Basic Structure**:
```
field operator value
```

**Example**:
```
deviceType equals "ServerDevice"
```

## Available Rule Fields

Rule fields represent properties of devices, software, and other system entities. Fields are dynamically registered by devices during discovery and stored in the system's rule field registry.

### How Rule Fields Work

**Field Registration**:
- Devices report their available fields during discovery using the `supportedFields` property
- Each field includes a name, type, optional label, and optional description
- The server automatically registers new fields in the `rule_fields` database table
- Once registered, fields become available for use in policy and restriction rules

**Field Types**:
The system supports the following field data types:
- `string`: Text values (e.g., "Linux", "production", "device-123")
- `number`: Numeric values (e.g., 16384, 4.5, 100)
- `boolean`: True/false values (e.g., true, false)
- `object`: Complex nested objects (advanced use)
- `array`: Arrays of values (advanced use)

**Field Naming**:
- Fields can use JSONPath format (e.g., `$.battery.level` for nested properties)
- Simple field names (e.g., `deviceId`, `osType`) are also supported
- Field names are case-sensitive

### Standard Device Fields

These are commonly reported fields that most devices provide:

#### Device Information Fields

These fields describe the device itself:

| Field Name | Type | Description | Example Values |
|------------|------|-------------|----------------|
| `$.os.name` | string | Operating system name| "windows", "macos" |
| `$.os.version` | string | Operating system version | "10.0", "11.0"  |
| `$.location.latitude` | number | Device location latitude | 40.741895 |
| `$.location.longitude` | number | Device location longitude| -73.989308 |
| `$.device.type` | string | Type of device| "agent", "agent_linux" |
| `$.battery.isCharging` | boolean | Indicates whether the device battery is currently charging| true, false |
| `$.battery.level` | number | Current battery level as a percentage (0-100) | 80.0 |
| `$.device.any` | boolean | When set to true, policy evaluation will pass regardless of other conditions. Use this to display components without special checks. | true, false  |



#### Viewing Available Fields

To see all available fields in your system:

1. Navigate to Policies or Restrictions in the Dashboard
2. Click **Create** or **Edit**
3. In the rule builder, click the **Field** dropdown
4. All available fields are listed with descriptions
5. Or navigate to **Settings** → **Rule Fields** (if available)

![Avilable fields image](./avilable_fields.png)

#### Adding New Fields

**Automatic Addition**:
Fields are automatically added when devices report them during discovery. The agent includes the `supportedFields` array in the discovery message with all fields it can provide.

**Manual Addition**:
Administrators can also manually add fields through the API:

**API Endpoint**: `POST /api/v1/upload/policies/fields` 

**Request Body**:
```json
{
  "name": "customField",
  "type": "string",
  "label": "Custom Field",
  "description": "A custom field for special use cases"
}
```

**Field Properties**:
- `name` (required): Field identifier (e.g., "region", "$.battery.level")
- `type` (required): Data type (string, number, boolean, object, array)
- `label` (optional): Human-readable display name
- `description` (optional): Detailed explanation of the field's purpose

#### Removing Fields

**API Endpoint**: `DELETE /api/v1/upload/policies/fields/{name}` 

**Note**: Removing a field does not delete it from existing rules, but it prevents it from being used in new rules.

#### Field Validation

When creating or updating rules:
1. The system validates that all referenced fields exist in the registry
2. Fields not in the registry will cause rule validation to fail
3. This ensures rules only reference fields that devices can actually provide

### Field Usage in Rules

**Field Reference Format**:
```json
{
  "field": "fieldName",
  "operator": "equals",
  "value": "expectedValue"
}
```

**Examples**:

Simple field:
```json
{
  "field": "osType",
  "operator": "equals",
  "value": "Linux"
}
```

Numeric field:
```json
{
  "field": "memoryMB",
  "operator": "greater-than-or-equals",
  "value": 16384
}
```

Boolean field:
```json
{
  "field": "canaryGroup",
  "operator": "equals",
  "value": "true"
}
```

JSONPath field (nested):
```json
{
  "field": "$.battery.level",
  "operator": "greater-than",
  "value": 20
}
```


## Operators

Operators define how field values are compared. Different operators work with different data types.

### Comparison Operators

Used for comparing values:

#### Equals (`equals`)

Checks if field exactly matches the value.

**Syntax**: `field equals value`

**Examples**:
```json
{ "field": "deviceType", "operator": "equals", "value": "ServerDevice" }
{ "field": "osType", "operator": "equals", "value": "Linux" }
{ "field": "environment", "operator": "equals", "value": "production" }
```

**Use Cases**:
- Match specific device types
- Target specific OS types
- Filter by environment

#### Not Equals (`not-equals`)

Checks if field does NOT match the value.

**Syntax**: `field not-equals value`

**Examples**:
```json
{ "field": "environment", "operator": "not-equals", "value": "development" }
{ "field": "deviceType", "operator": "not-equals", "value": "TestDevice" }
```

**Use Cases**:
- Exclude specific values
- Block all except certain types
- Negative filtering

#### Greater Than (`greater-than`)

Checks if field is greater than the value (numeric comparison).

**Syntax**: `field greater-than value`

**Examples**:
```json
{ "field": "memoryMB", "operator": "greater-than", "value": 8192 }
{ "field": "cpuCores", "operator": "greater-than", "value": 4 }
```

**Use Cases**:
- Minimum hardware requirements
- Resource-based filtering
- Version comparison (for sortable version strings)

#### Less Than (`less-than`)

Checks if field is less than the value (numeric comparison).

**Syntax**: `field less-than value`

**Examples**:
```json
{ "field": "diskSpaceGB", "operator": "less-than", "value": 50 }
{ "field": "memoryMB", "operator": "less-than", "value": 4096 }
```

**Use Cases**:
- Maximum limits
- Blocking on low-resource devices
- Legacy version blocking

#### Greater Than or Equal (`greater-than-or-equals`)

Checks if field is greater than or equal to the value.

**Syntax**: `field greater-than-or-equals value`

**Examples**:
```json
{ "field": "memoryMB", "operator": "greater-than-or-equals", "value": 16384 }
{ "field": "osVersion", "operator": "greater-than-or-equals", "value": "20.04" }
```

**Use Cases**:
- Minimum requirements (inclusive)
- Version requirements

#### Less Than or Equal (`less-than-or-equals`)

Checks if field is less than or equal to the value.

**Syntax**: `field less-than-or-equals value`

**Examples**:
```json
{ "field": "cpuCores", "operator": "less-than-or-equals", "value": 8 }
{ "field": "memoryMB", "operator": "less-than-or-equals", "value": 32768 }
```

**Use Cases**:
- Maximum limits (inclusive)
- Resource constraints

### String Operators

Used for string pattern matching:

#### Contains (`contains`)

Checks if field contains the substring.

**Syntax**: `field contains value`

**Examples**:
```json
{ "field": "deviceName", "operator": "contains", "value": "prod" }
{ "field": "version", "operator": "contains", "value": "-beta" }
{ "field": "osVersion", "operator": "contains", "value": "Ubuntu" }
```

**Use Cases**:
- Partial string matching
- Finding devices with naming patterns
- Version suffix matching (beta, alpha, dev)

#### Starts With (`starts-with`)

Checks if field starts with the substring.

**Syntax**: `field starts-with value`

**Examples**:
```json
{ "field": "deviceName", "operator": "starts-with", "value": "prod-" }
{ "field": "projectName", "operator": "starts-with", "value": "Company." }
{ "field": "version", "operator": "starts-with", "value": "2." }
```

**Use Cases**:
- Namespace filtering
- Naming convention matching
- Version major version filtering

#### Ends With (`ends-with`)

Checks if field ends with the substring.

**Syntax**: `field ends-with value`

**Examples**:
```json
{ "field": "deviceName", "operator": "ends-with", "value": ".prod" }
{ "field": "hostname", "operator": "ends-with", "value": ".company.com" }
{ "field": "version", "operator": "ends-with", "value": "-dev" }
```

**Use Cases**:
- Domain matching
- Version suffix matching
- Naming convention filtering

#### Matches (`matches`)

Checks if field matches a regular expression pattern.

**Syntax**: `field matches pattern`

**Examples**:
```json
{ "field": "version", "operator": "matches", "value": "^[0-9]+\\.[0-9]+\\.[0-9]+$" }
{ "field": "deviceName", "operator": "matches", "value": "^prod-(server|worker)-[0-9]+$" }
{ "field": "ipAddress", "operator": "matches", "value": "^192\\.168\\." }
```

**Use Cases**:
- Complex pattern matching
- Version format validation
- Advanced string filtering

**Note**: Regex patterns use standard regular expression syntax. Remember to escape special characters.

### Collection Operators

Used for checking membership in lists:

#### In (`in`)

Checks if field value is in the provided list.

**Syntax**: `field in [value1, value2, ...]`

**Examples**:
```json
{ "field": "region", "operator": "in", "value": ["us-east", "us-west", "us-central"] }
{ "field": "deviceType", "operator": "in", "value": ["ServerDevice", "WorkstationDevice"] }
```

**Use Cases**:
- Multiple value matching
- List-based filtering
- Alternative to multiple OR conditions

#### Not In (`not-in`)

Checks if field value is NOT in the provided list.

**Syntax**: `field not-in [value1, value2, ...]`

**Examples**:
```json
{ "field": "environment", "operator": "not-in", "value": ["test", "sandbox"] }
{ "field": "osType", "operator": "not-in", "value": ["Legacy", "Deprecated"] }
```

**Use Cases**:
- Exclusion lists
- Blacklisting
- Multiple value negation

### Existence Operators

Used for checking if fields exist or have values:

#### Exists (`exists`)

Checks if the field exists and has a non-null value.

**Syntax**: `field exists`

**Examples**:
```json
{ "field": "canaryGroup", "operator": "exists" }
{ "field": "maintenanceWindow", "operator": "exists" }
```

**Use Cases**:
- Check if custom field is set
- Require specific properties
- Validate field presence

#### Not Exists (`not-exists`)

Checks if the field does not exist or has a null value.

**Syntax**: `field not-exists`

**Examples**:
```json
{ "field": "deprecationDate", "operator": "not-exists" }
{ "field": "errorFlag", "operator": "not-exists" }
```

**Use Cases**:
- Exclude devices with certain flags
- Check for missing properties
- Validate field absence

### Logical Operators

Used for combining multiple conditions:

#### AND (`and`)

All conditions must be true.

**Syntax**:
```json
{
  "and": [
    { "field": "field1", "operator": "equals", "value": "value1" },
    { "field": "field2", "operator": "equals", "value": "value2" }
  ]
}
```

**Examples**:
```json
{
  "and": [
    { "field": "deviceType", "operator": "equals", "value": "ServerDevice" },
    { "field": "environment", "operator": "equals", "value": "production" }
  ]
}
```

**Use Cases**:
- Combining multiple requirements
- All criteria must match
- Intersection of conditions

#### OR (`or`)

At least one condition must be true.

**Syntax**:
```json
{
  "or": [
    { "field": "field1", "operator": "equals", "value": "value1" },
    { "field": "field2", "operator": "equals", "value": "value2" }
  ]
}
```

**Examples**:
```json
{
  "or": [
    { "field": "region", "operator": "equals", "value": "us-east" },
    { "field": "region", "operator": "equals", "value": "us-west" }
  ]
}
```

**Use Cases**:
- Alternative conditions
- Any criteria matches
- Union of conditions

#### NOT (`none`)

Negates a condition or group of conditions.

**Syntax**:
```json
{
  "none": [
    { "field": "field1", "operator": "equals", "value": "value1" }
  ]
}
```

**Examples**:
```json
{
  "none": [
    { "field": "environment", "operator": "equals", "value": "development" }
  ]
}
```

**Use Cases**:
- Inversion of logic
- Negating complex conditions
- Exclusion logic

## Building Complex Rules

### Simple Rule Example

Match production servers:

```json
{
  "field": "environment",
  "operator": "equals",
  "value": "production"
}
```

### AND Rule Example

Match production servers with at least 16GB RAM:

```json
{
  "and": [
    {
      "field": "environment",
      "operator": "equals",
      "value": "production"
    },
    {
      "field": "memoryMB",
      "operator": "greater-than-or-equals",
      "value": 16384
    }
  ]
}
```

### OR Rule Example

Match devices in US East or US West:

```json
{
  "or": [
    {
      "field": "region",
      "operator": "equals",
      "value": "us-east"
    },
    {
      "field": "region",
      "operator": "equals",
      "value": "us-west"
    }
  ]
}
```

### Nested Rule Example

Match server devices in production or staging:

```json
{
  "and": [
    {
      "field": "deviceType",
      "operator": "equals",
      "value": "ServerDevice"
    },
    {
      "or": [
        {
          "field": "environment",
          "operator": "equals",
          "value": "production"
        },
        {
          "field": "environment",
          "operator": "equals",
          "value": "staging"
        }
      ]
    }
  ]
}
```

### Complex Nested Example

Match devices meeting multiple criteria:

```json
{
  "and": [
    {
      "or": [
        {
          "field": "deviceType",
          "operator": "equals",
          "value": "ServerDevice"
        },
        {
          "field": "deviceType",
          "operator": "equals",
          "value": "WorkstationDevice"
        }
      ]
    },
    {
      "and": [
        {
          "field": "memoryMB",
          "operator": "greater-than-or-equals",
          "value": 8192
        },
        {
          "field": "diskSpaceGB",
          "operator": "greater-than-or-equals",
          "value": 100
        }
      ]
    },
    {
      "none": [
        {
          "field": "environment",
          "operator": "equals",
          "value": "deprecated"
        }
      ]
    }
  ]
}
```

This matches:
- (ServerDevice OR WorkstationDevice) AND
- (memoryMB >= 8192 AND diskSpaceGB >= 100) AND
- (NOT deprecated environment)

## Common Rule Patterns

### Pattern 1: Device Type Filtering

Target specific device types:

```json
{
  "field": "deviceType",
  "operator": "in",
  "value": ["ServerDevice", "WorkstationDevice", "EdgeDevice"]
}
```

### Pattern 2: Environment-Based

Different rules for different environments:

```json
{
  "and": [
    { "field": "environment", "operator": "equals", "value": "production" },
    { "field": "memoryMB", "operator": "greater-than-or-equals", "value": 32768 }
  ]
}
```

### Pattern 3: Version Range

Allow versions within a range:

```json
{
  "and": [
    { "field": "version", "operator": "greater-than-or-equals", "value": "2.0.0" },
    { "field": "version", "operator": "less-than", "value": "3.0.0" }
  ]
}
```

### Pattern 4: Exclusion List

Block specific projects:

```json
{
  "field": "projectName",
  "operator": "in",
  "value": ["BlockedApp1", "BlockedApp2", "BlockedApp3"]
}
```

### Pattern 5: Hardware Requirements

Require minimum hardware specs:

```json
{
  "and": [
    { "field": "memoryMB", "operator": "greater-than-or-equals", "value": 16384 },
    { "field": "cpuCores", "operator": "greater-than-or-equals", "value": 8 },
    { "field": "diskSpaceGB", "operator": "greater-than-or-equals", "value": 500 }
  ]
}
```

### Pattern 6: Regional Restrictions

Limit to specific regions:

```json
{
  "none": [
    {
      "field": "region",
      "operator": "in",
      "value": ["restricted-region-1", "restricted-region-2"]
    }
  ]
}
```

### Pattern 7: Canary Deployment

Target canary group:

```json
{
  "and": [
    { "field": "canaryGroup", "operator": "equals", "value": "true" },
    { "field": "environment", "operator": "not-equals", "value": "development" }
  ]
}
```

### Pattern 8: OS-Specific

Different rules for different operating systems:

```json
{
  "and": [
    { "field": "osType", "operator": "equals", "value": "Linux" },
    { "field": "osVersion", "operator": "contains", "value": "Ubuntu" }
  ]
}
```

### Pattern 9: Legacy Version Blocking

Block old versions:

```json
{
  "and": [
    { "field": "projectName", "operator": "equals", "value": "MyApplication" },
    { "field": "version", "operator": "less-than", "value": "2.0.0" }
  ]
}
```

### Pattern 10: Compliance Requirements

Require certification:

```json
{
  "and": [
    { "field": "environment", "operator": "equals", "value": "production" },
    { "field": "fdaCertified", "operator": "equals", "value": "true" }
  ]
}
```

## Value Types and Formats

### String Values

Enclosed in quotes:
```json
"value": "StringValue"
```

Case-sensitive by default (depends on operator and field).

### Numeric Values

Not enclosed in quotes:
```json
"value": 12345
```

Used for memory, CPU cores, disk space, etc.

### Boolean Values

Use string representation:
```json
"value": "true"
```
or
```json
"value": "false"
```

### Array Values

For `in` and `notIn` operators:
```json
"value": ["value1", "value2", "value3"]
```

### Version Strings

Versions as strings:
```json
"value": "1.2.3"
```

Comparison depends on whether semantic versioning is supported.

## Testing Rule Expressions

### Manual Testing

Test rules manually:

1. Create policy/restriction as inactive
2. Activate on test device
3. Check evaluation results in logs
4. Verify expected behavior
5. Adjust rule if needed

### Common Testing Scenarios

**Test Device Properties**:
- Set known device properties
- Create rule matching those properties
- Verify it evaluates correctly

**Test Edge Cases**:
- Empty strings
- Null values
- Missing fields
- Boundary values (0, negative numbers)

**Test Complex Logic**:
- Test each branch of OR conditions
- Verify AND conditions require all to match
- Test nested conditions thoroughly

## Best Practices

### Keep Rules Simple

- Prefer simple rules over complex nested rules when possible
- Break complex logic into multiple simpler policies/restrictions
- Use readable field and value names

### Use Appropriate Operators

- Use `in` instead of multiple OR conditions for lists
- Use `contains` for substring matching instead of regex when possible
- Use `greater-than-or-equals`/`less-than-or-equals` for inclusive ranges

### Document Complex Rules

- Add clear descriptions explaining the rule's purpose
- Document why specific values are used
- Note any dependencies or related rules

### Test Thoroughly

- Test rules before activating
- Verify all branches of complex conditions
- Test with real device data
- Monitor initial rollout

### Optimize for Performance

- Put most selective conditions first in AND chains
- Avoid deeply nested conditions when possible
- Use indexed fields when available

### Version Strings

- Use semantic versioning (1.2.3)
- Be consistent with version formats
- Document version comparison behavior

### Custom Fields

- Use descriptive field names
- Document custom field meanings
- Set defaults for custom fields
- Validate field values

## Troubleshooting Rules

### Rule Not Matching

**Check**:
- Field names are spelled correctly
- Values match exactly (case-sensitive)
- Operator is appropriate for the data type
- Device actually has the field set

### Rule Matching Unexpectedly

**Check**:
- Operator logic (equals vs not-equals)
- Nested conditions and logical operators
- String matching (contains vs equals)
- Case sensitivity

### Performance Issues

**Check**:
- Overly complex nested rules
- Inefficient regex patterns
- Too many conditions
- Unindexed field queries

### Syntax Errors

**Check**:
- JSON syntax validity
- Quotes around strings
- Comma placement
- Bracket matching

## Next Steps

- Practice with [Managing Policies](./managing-policies.md)
- Practice with [Managing Restrictions](./managing-restrictions.md)
- Review [Best Practices](./best-practices.md)
- Understand [Policies](./understanding-policies.md) and [Restrictions](./understanding-restrictions.md)
