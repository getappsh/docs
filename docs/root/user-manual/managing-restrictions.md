# Managing Restrictions

This guide provides step-by-step instructions for creating, viewing, editing, and deleting restrictions using the GetApp Dashboard.

## Prerequisites

Before managing restrictions, ensure you have:
- Access to the GetApp Dashboard
- Appropriate user permissions (Restriction management roles)
- At least one registered device or device type


## Accessing Restriction Management

Restrictions and policies are managed together on the same page.

### Navigation Path

1. Log in to the GetApp Dashboard
2. Navigate to **Rules** in the main menu
3. Both restrictions and policies are displayed in the same list

![Navigation to Rules page showing both policies and restrictions](/img/rule_and_restricions_page.png)

**Note**: The Rules page displays both restrictions and policies together. 

## Viewing Restrictions

### Restrictions List View

The restrictions list displays all defined restrictions in your system.

**Information Displayed:**
- **Name**: Restriction identifier
- **Type**: "Restriction" 
- **Version**: Current version number
- **Association**: What the restriction applies to (devices, device types, OS types)
- **Status**: Active or Inactive
- **Actions**: Edit, Delete, Duplicate, View buttons




### Viewing Restriction Details

To view detailed information about a restriction:

1. Click on the **restriction name** in the list
2. A details panel opens showing:
   - Full restriction name
   - Description
   - Type (Restriction)
   - Version number
   - Creation date
   - Last modified date
   - Active/Inactive status
   - Associations (device IDs, device types, OS types)
   - Complete rule definition
   - List of affected devices


### Understanding What Gets Blocked

The restriction details show:
- **Rule Expression**: What conditions trigger the block
- **Effect**: What gets blocked when the rule matches
- **Affected Devices**: Which devices have this restriction
- **Evaluation Count**: How many times it has been evaluated (if tracked)

## Creating a New Restriction

### Opening the Create Dialog

1. Navigate to the Rules page
2. Click the **Create** or **Add Rule** button
3. A popup dialog opens with a 3-step wizard

### Step 1: Basic Information

In the first step, configure the basic restriction details:

**Name** (Required):
- Enter a descriptive name
- Must be unique within your restrictions
- Examples: "Block Dev Software on Production", "Prevent GPU Apps on Basic Workstations"

**Description** (Optional):
- Add a detailed explanation
- Explain what is blocked and why
- Document any special considerations

**Type** (Required):
- Select **Restriction** from the dropdown
- (Policy is the other option)

**Status** (Required):
- **Active**: Restriction takes effect immediately and syncs to devices
- **Inactive**: Restriction is created but not enforced (for testing or future use)

![Step 1 - Basic information with name, description, type, and status fields](/img/step_1.png)

Click **Next** to proceed to step 2.

### Step 2: Build the Rule

In the third and final step, select what this restriction applies to. You can choose one or more association types:

#### Associate with Specific Devices

To apply this restriction to individual devices:

1. Click **Add Devices** or select **Device** tab
2. Search for devices by name or ID
3. Select devices from the list
4. Click **Add**
5. Selected devices appear in the association list

**Use When**: Targeting specific critical devices with unique requirements.

#### Associate with Device Types

To apply this restriction to all devices of certain types:

1. Click **Add Device Types** or select **Device Type** tab
2. Select one or more device types from the dropdown
3. Click **Add**
4. Selected device types appear in the association list

**Use When**: Applying hardware-specific restrictions to entire classes of devices.

**Example**: All "LegacyServer" devices should have certain restrictions.

#### Associate with OS Types

To apply this restriction to all devices with certain operating systems:

1. Click **Add OS Types** or select **OS Type** tab
2. Select one or more OS types from the dropdown
3. Options typically include: Linux, Windows, MacOS, etc.
4. Click **Add**
5. Selected OS types appear in the association list

**Use When**: Applying OS-specific compatibility restrictions.

**Example**: Block certain software on all Linux devices.

#### Combined Associations

You can combine multiple association types:
- Add device IDs AND device types AND OS types
- The restriction applies to devices matching ANY of the associations (OR logic)

**Example**: Apply to device-12345 OR all ProductionServers OR all Linux devices.

In the second step, create the rule expression that defines what gets blocked.

The rule builder provides:
- **Visual Rule Builder**: A graphical interface for building rules
- **JSON Preview**: Real-time JSON representation of your rule

#### Understanding Blocking Logic

When the rule evaluates to **true**, the installation is **blocked**.

**Example**: If rule is `projectName equals "BlockedApp"`, then installations of BlockedApp are prevented.

#### Simple Rule

For a simple blocking condition:

1. Select **Simple Rule** option
2. Choose a **Field** from the dropdown
   - Common fields: projectName, version, environment, requiresGPU, etc.
3. Choose an **Operator**
   - Common operators: equals, not-equls, contains, less-than, greater-than 
4. Enter the **Value**
   - The value to compare against
5. See the JSON preview update automatically

**Example**: Block project "UnsafeApp"
- Field: `projectName`
- Operator: `equals`
- Value: `UnsafeApp`

#### Complex Rule with AND

To block when multiple conditions are ALL true:

1. Select **Complex Rule** option
2. Choose **AND** operator
3. Click **Add Condition**
4. For each condition:
   - Select field
   - Select operator
   - Enter value
5. Add more conditions as needed

**Example**: Block "MyApp" versions older than 2.0.0
- Condition 1: `projectName equals "MyApp"`
- Condition 2: `version less-than "2.0.0"`

#### Complex Rule with OR

To block when ANY of multiple conditions is true:

1. Select **Complex Rule** option
2. Choose **OR** operator
3. Click **Add Condition**
4. For each condition:
   - Select field
   - Select operator
   - Enter value
5. Add more conditions as needed

**Example**: Block multiple problematic projects
- Condition 1: `projectName equals "BadApp1"`
- Condition 2: `projectName equals "BadApp2"`
- Condition 3: `projectName equals "BadApp3"`

#### Nested Conditions

For advanced blocking logic:

1. Start with an outer operator (AND or OR)
2. Add conditions
3. For nested logic, click **Add Group**
4. Within the group, select operator (AND or OR)
5. Add conditions to the nested group

**Example**: Block BadApp1, BadApp2, or ConditionalApp in production
- Outer: OR
  - `projectName equals "BadApp1"`
  - `projectName equals "BadApp2"`
  - Inner: AND
    - `projectName equals "ConditionalApp"`
    - `environment equals "production"`

![Step 2 - Visual rule builder with JSON preview showing rule construction](/img/step_2.1.png)

![Step 2 - Visual rule builder with JSON preview showing rule construction](/img/step_2.2.png)

Click **Next** to proceed to step 3.

### Step 3: Define Associations


![Step 3 - Association interface showing devices, device types, and OS types options for restrictions](/img/step_3_restricion.png)


In the third and final step, select what this restriction applies to. You can choose one or more association types:

#### Associate with Specific Devices

To apply this restriction to individual devices:

1. Click **Add Devices** or select **Device** tab
2. Search for devices by name or ID
3. Select devices from the list
4. Click **Add**
5. Selected devices appear in the association list

**Use When**: Targeting specific critical devices with unique requirements.

#### Associate with Device Types

To apply this restriction to all devices of certain types:

1. Click **Add Device Types** or select **Device Type** tab
2. Select one or more device types from the dropdown
3. Click **Add**
4. Selected device types appear in the association list

**Use When**: Applying hardware-specific restrictions to entire classes of devices.

**Example**: All "LegacyServer" devices should have certain restrictions.

#### Associate with OS Types

To apply this restriction to all devices with certain operating systems:

1. Click **Add OS Types** or select **OS Type** tab
2. Select one or more OS types from the dropdown
3. Options typically include: Linux, Windows, MacOS, etc.
4. Click **Add**
5. Selected OS types appear in the association list

**Use When**: Applying OS-specific compatibility restrictions.

**Example**: Block certain software on all Linux devices.

#### Combined Associations

You can combine multiple association types:
- Add device IDs AND device types AND OS types
- The restriction applies to devices matching ANY of the associations (OR logic)

**Example**: Apply to device-12345 OR all ProductionServers OR all Linux devices.

### Review and Save

1. Review all entered information across all three steps
2. You can navigate back to any step to make changes
3. Preview the rule JSON one final time
4. Click **Create** or **Save**
5. The popup closes and the new restriction appears in the list
6. A confirmation message appears
7. If active, it will sync to affected devices

### Common Creation Errors

**Error: "Restriction name already exists"**
- Solution: Choose a unique name

**Error: "No associations selected"**
- Solution: Associate with at least one device, device type, or OS type

**Error: "Invalid rule expression"**
- Solution: Check that all fields, operators, and values are properly filled in

**Error: "Insufficient permissions"**
- Solution: Contact your administrator for restriction creation permissions

## Editing an Existing Restriction

### Step 1: Open Edit Dialog

1. Locate the restriction in the restrictions list
2. Click the **Edit** button (pencil icon)
3. The Edit Restriction dialog opens with current values populated


### Step 2: Modify Restriction Details

You can modify:
- **Name**: Change the restriction name
- **Description**: Update the description
- **Associations**: Add or remove devices, device types, or OS types
- **Rule Expression**: Modify the blocking logic
- **Status**: Activate or deactivate

**Note**: Changing the rule expression or associations will increment the version number automatically.

### Step 3: Update Associations

To modify what the restriction applies to:

**Add Associations**:
1. Click **Add Devices** / **Add Device Types** / **Add OS Types**
2. Select additional items
3. Click **Add**

**Remove Associations**:
1. Find the association in the list
2. Click the  **DELETE** button next to it
3. Confirm removal if prompted


### Step 4: Update the Rule

To modify the blocking rule:

**Simple Changes**:
- Update field, operator, or value
- Changes are previewed in real-time

**Add Conditions**:
- Click **Add Condition** to add more blocking criteria
- Select the field, operator, and value

**Remove Conditions**:
- Click the **Trash** button next to a condition

**Change Logic**:
- Switch between AND/OR operators
- Reorganize nested groups


### Step 5: Save Changes

1. Review all modifications
2. Click **Update Restriction** or **Save**
3. Version number increments automatically (if rule or association changed)
4. Confirmation message appears
5. Changes sync to affected devices (if restriction is active)


### Sync Status

After saving:
- Active restrictions sync to devices during their next synchronization
- Monitor the sync status in the restriction details
- Devices may take a few minutes to receive updates

## Activating and Deactivating Restrictions

### Activate a Restriction

To make an inactive restriction active:

**Method 1: From Details View**
1. Click on the restriction name to open details
2. Toggle the **Status** switch to Active
3. Confirm the action
4. Restriction immediately syncs to devices and begins blocking

**Method 2: From Edit Dialog**
1. Click **Edit** on the restriction
2. Check the **Active** checkbox
3. Click **Save**


### Deactivate a Restriction

To temporarily suspend a restriction without deleting it:

**Method 1: From Details View**
1. Click on the restriction name
2. Toggle the **Status** switch to Inactive
3. Confirm the action
4. Restriction stops blocking and is removed from devices

**Method 2: From Edit Dialog**
1. Click **Edit** on the restriction
2. Uncheck the **Active** checkbox
3. Click **Save**

**When to Deactivate**:
- Testing other restrictions
- Allowing updates during maintenance windows
- Troubleshooting issues
- Emergency override situations


### Sync After Status Change

When you activate or deactivate a restriction:
- Devices receive the update during next sync (typically within minutes)
- Active restrictions are added to device local storage
- Inactive restrictions are removed from device local storage

## Duplicating a Restriction

Duplicating creates a copy of an existing restriction, useful for creating similar restrictions.

### Step 1: Duplicate

1. Locate the restriction to duplicate
2. Click the **Duplicate** button (copy icon)
3. A new restriction is created with:
   - Name: "Copy of [Original Name]"
   - Same rule expression
   - Same associations
   - Status: Inactive (by default)
   - Version: 1 (new restriction)


### Step 2: Modify the Copy

1. Edit the duplicated restriction
2. Change the name
3. Modify the rule or associations as needed
4. Activate when ready

**Use Cases**:
- Creating similar restrictions for different device types
- Testing variations of a restriction
- Applying the same logic to different devices

## Deleting a Restriction

**Warning**: Deleting a restriction is permanent and cannot be undone. The restriction will no longer block installations on associated devices.

### Step 1: Delete

1. Locate the restriction to delete
2. Click the **Delete** button (trash icon)
3. A confirmation dialog appears



![Screenshot: Delete button and confirmation](/img/delete_rule_dialog.png)


### Step 2: Confirm Deletion

1. Review the warning message
2. See which devices will be affected
3. Optionally, enter the restriction name for additional confirmation
4. Click on **OK** 
5. Restriction is permanently removed

### After Deletion

- Restriction is removed from the server
- On next sync, devices remove the restriction from local storage
- Previously blocked software is no longer blocked by this restriction

### Alternative to Deletion

Instead of deleting, consider:
- **Deactivating**: Temporarily suspend without removing
- **Documenting**: Add notes about why it's no longer needed before deleting

## Testing Restrictions

Before activating a restriction, test it to ensure it works as expected.

### Test Rule Evaluation

Some Dashboard implementations provide a testing feature:

1. Open the restriction details or edit dialog
2. Click **Test Rule** or **Evaluate** button
3. Enter sample software properties (projectName, version, etc.)
4. Click **Evaluate**
5. See if the rule matches (true = blocked, false = allowed)
6. Adjust the rule if needed


### Test on Non-Production Devices

1. Create the restriction but keep it **Inactive**
2. Review the rule logic carefully
3. Associate with a test device first
4. Activate the restriction
5. Attempt to install software on the test device
6. Verify expected blocking behavior
7. Check agent logs for restriction evaluation
8. Deactivate if issues are found
9. Fix and re-test
10. Expand associations once validated

### Monitor Agent Logs

After activating a restriction:
1. Check agent logs on affected devices
2. Look for restriction evaluation messages
3. Verify expected installations are blocked
4. Watch for unexpected blockages
5. Review any evaluation errors

### Gradual Rollout

For critical restrictions:
1. Start with a small group of test devices
2. Monitor for a period (hours or days)
3. Gradually expand to more devices
4. Expand to device types only when confident
5. Monitor continuously

## Viewing Restriction History

Restriction version history helps track changes over time.

### Version Number

Each restriction displays its current version number. The version increments when:
- The rule expression is modified
- The associations change

### Sync History

Some systems track sync history:
- When the restriction was synced to each device
- Success or failure status
- Version synced to each device

## Monitoring Restriction Effectiveness

### Blocked Installation Count

Track how many installations each restriction has blocked:
1. View restriction details
2. Check **Blocked Count** or **Evaluations** section
3. See which devices were affected


### Affected Devices List

See which devices currently have the restriction:
1. Open restriction details
2. View **Affected Devices** tab
3. See list of devices, their types, and sync status

### Restriction Impact Report

Generate reports on restriction effectiveness:
- Number of blocks per restriction
- Most frequently blocked software
- Devices most affected by restrictions

## Restriction Management Best Practices

### Naming Conventions

Use clear, descriptive naming:
- **Good**: "Block-Dev-Software-Production", "Prevent-Old-SSL-Library"
- **Avoid**: "Restriction1", "test", "temp"

### Documentation

Always add descriptions:
- Explain what is blocked and why
- Document the business reason or compliance requirement
- Note any dependencies or related restrictions
- Include contact information for questions

### Start Inactive and Narrow

When creating new restrictions:
1. Create with **Inactive** status
2. Associate with a test device first
3. Test thoroughly
4. Activate for test device
5. Expand associations gradually
6. Monitor continuously

### Regular Reviews

Periodically review your restrictions:
- Remove obsolete restrictions
- Update outdated criteria
- Consolidate overlapping restrictions
- Document changes
- Verify restrictions still serve their purpose

### Testing Workflow

1. Create restriction (inactive)
2. Associate with test device
3. Review rule logic
4. Activate for test device
5. Test blocking behavior
6. Monitor agent logs
7. Expand to device type or OS type
8. Monitor production impact
9. Continue monitoring

### Monitor Device Logs

Regularly check agent logs:
- Look for unexpected blockages
- Verify restrictions are working as intended
- Identify any evaluation errors
- Understand user impact

## Troubleshooting

### Restriction Not Blocking

**Problem**: Created restriction but software still installs.

**Solutions**:
1. Verify restriction is **Active**
2. Check device is in the associations (device ID, type, or OS)
3. Verify rule logic matches the software being installed
4. Ensure device has synced recently
5. Check agent logs for restriction evaluation
6. Verify agent version supports restrictions
7. Test rule evaluation manually
8. Check for conflicting or overriding configurations

### Installation Blocked Unexpectedly

**Problem**: Software is blocked but shouldn't be.

**Solutions**:
1. Check which restriction is blocking (agent logs show this)
2. Review the restriction's rule logic
3. Verify the software properties match the rule
4. Check if multiple restrictions apply
5. Deactivate the restriction temporarily if needed
6. Modify the rule to be more specific
7. Test the updated rule

### Restriction Not Syncing

**Problem**: Restriction not appearing on devices.

**Solutions**:
1. Verify restriction is **Active**
2. Check device association is correct
3. Ensure device is online and connected
4. Trigger manual sync from device or Dashboard
5. Check network connectivity
6. Review server logs for sync errors
7. Verify agent is running and up-to-date
8. Check agent sync interval settings

### Performance Issues

**Problem**: Agent is slow due to restriction evaluation.

**Solutions**:
1. Simplify restriction rules
2. Reduce number of restrictions per device
3. Remove obsolete restrictions
4. Optimize rule expressions
5. Check device resources (CPU, memory)
6. Review agent logs for evaluation errors

### Can't Create Restriction

**Problem**: Create button doesn't work or error when saving.

**Solutions**:
1. Check user permissions
2. Verify all required fields are filled
3. Check rule syntax is valid
4. Ensure at least one association is selected
5. Try a different browser if UI issues persist
6. Check for conflicting browser extensions

## Next Steps

- Learn about [Managing Policies](./managing-policies.md)
- Understand [Rule Fields and Expressions](./rule-fields-expressions.md)
