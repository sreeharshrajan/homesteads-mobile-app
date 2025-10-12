# React Native Paper - Quick Reference

## Installation

```bash
npm install react-native-paper@5.14.5
```

Already installed ✓

---

## Basic Setup

### 1. Provider (App.js)

```javascript
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme } from './src/config/theme';

<PaperProvider theme={lightTheme}>
  <App />
</PaperProvider>
```

### 2. Theme Hook

```javascript
import { useTheme } from 'react-native-paper';

const theme = useTheme();
const backgroundColor = theme.colors.primary;
```

---

## Most Used Components

### Buttons

```javascript
// Primary button
<Button mode="contained" onPress={handlePress}>
  Save
</Button>

// Secondary button
<Button mode="outlined" onPress={handlePress}>
  Cancel
</Button>

// Text button
<Button mode="text" onPress={handlePress}>
  Skip
</Button>

// With icon
<Button mode="contained" icon="plus" onPress={handlePress}>
  Add Customer
</Button>

// Loading state
<Button mode="contained" loading={isLoading} disabled={isLoading}>
  Saving...
</Button>
```

### Text Input

```javascript
// Outlined (recommended)
<TextInput
  mode="outlined"
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={hasError}
  left={<TextInput.Icon icon="email" />}
  right={<TextInput.Icon icon="eye" onPress={togglePassword} />}
/>

// Multiline
<TextInput
  mode="outlined"
  label="Description"
  value={description}
  onChangeText={setDescription}
  multiline
  numberOfLines={4}
/>

// With helper text
<TextInput mode="outlined" label="Password" error={hasError} />
<HelperText type="error" visible={hasError}>
  Password must be at least 8 characters
</HelperText>
```

### Cards

```javascript
<Card onPress={handlePress}>
  <Card.Cover source={{ uri: 'https://...' }} />
  <Card.Content>
    <Title>Card Title</Title>
    <Paragraph>Card description text</Paragraph>
  </Card.Content>
  <Card.Actions>
    <Button>Cancel</Button>
    <Button>OK</Button>
  </Card.Actions>
</Card>
```

### App Bar

```javascript
<Appbar.Header>
  <Appbar.BackAction onPress={goBack} />
  <Appbar.Content title="Screen Title" />
  <Appbar.Action icon="magnify" onPress={search} />
  <Appbar.Action icon="dots-vertical" onPress={openMenu} />
</Appbar.Header>
```

### FAB (Floating Action Button)

```javascript
// Simple FAB
<FAB icon="plus" style={styles.fab} onPress={handlePress} />

// FAB with label
<FAB icon="plus" label="Add" style={styles.fab} onPress={handlePress} />

// FAB Group
<FAB.Group
  open={open}
  icon={open ? 'close' : 'plus'}
  actions={[
    { icon: 'email', label: 'Email', onPress: sendEmail },
    { icon: 'phone', label: 'Call', onPress: makeCall },
  ]}
  onStateChange={({ open }) => setOpen(open)}
/>

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
```

### Dialog

```javascript
import { Dialog, Portal } from 'react-native-paper';

<Portal>
  <Dialog visible={visible} onDismiss={hideDialog}>
    <Dialog.Title>Alert</Dialog.Title>
    <Dialog.Content>
      <Paragraph>This is a dialog</Paragraph>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={hideDialog}>Cancel</Button>
      <Button onPress={handleConfirm}>OK</Button>
    </Dialog.Actions>
  </Dialog>
</Portal>
```

### Snackbar

```javascript
<Snackbar
  visible={visible}
  onDismiss={onDismiss}
  duration={3000}
  action={{
    label: 'Undo',
    onPress: handleUndo,
  }}
>
  Customer saved successfully!
</Snackbar>
```

### Menu

```javascript
const [visible, setVisible] = useState(false);

<Menu
  visible={visible}
  onDismiss={closeMenu}
  anchor={<Button onPress={openMenu}>Menu</Button>}
>
  <Menu.Item onPress={() => {}} title="Edit" leadingIcon="pencil" />
  <Menu.Item onPress={() => {}} title="Delete" leadingIcon="delete" />
  <Divider />
  <Menu.Item onPress={() => {}} title="Settings" leadingIcon="cog" />
</Menu>
```

### Chips

```javascript
// Default chip
<Chip icon="information" onPress={handlePress}>
  Info
</Chip>

// Selected chip (filter)
<Chip
  selected={isSelected}
  onPress={toggleSelected}
  mode="outlined"
>
  Active
</Chip>

// Closeable chip
<Chip
  icon="check"
  onClose={handleClose}
  closeIcon="close"
>
  Tag
</Chip>
```

### Searchbar

```javascript
<Searchbar
  placeholder="Search"
  onChangeText={setSearchQuery}
  value={searchQuery}
  icon="magnify"
  clearIcon="close"
/>
```

### Lists

```javascript
// Simple list item
<List.Item
  title="First Item"
  description="Item description"
  left={props => <List.Icon {...props} icon="folder" />}
  right={props => <List.Icon {...props} icon="chevron-right" />}
  onPress={handlePress}
/>

// Accordion
<List.Accordion
  title="Uncontrolled Accordion"
  left={props => <List.Icon {...props} icon="folder" />}
>
  <List.Item title="First item" />
  <List.Item title="Second item" />
</List.Accordion>

// Section
<List.Section>
  <List.Subheader>Some title</List.Subheader>
  <List.Item title="First Item" />
  <List.Item title="Second Item" />
</List.Section>
```

### Data Table

```javascript
<DataTable>
  <DataTable.Header>
    <DataTable.Title>Name</DataTable.Title>
    <DataTable.Title numeric>Qty</DataTable.Title>
    <DataTable.Title numeric>Price</DataTable.Title>
  </DataTable.Header>

  <DataTable.Row>
    <DataTable.Cell>Product A</DataTable.Cell>
    <DataTable.Cell numeric>2</DataTable.Cell>
    <DataTable.Cell numeric>$250</DataTable.Cell>
  </DataTable.Row>

  <DataTable.Pagination
    page={page}
    numberOfPages={3}
    onPageChange={setPage}
    label="1-2 of 6"
  />
</DataTable>
```

### Badge

```javascript
<Badge size={20}>3</Badge>

// On icon
<View>
  <Icon source="bell" size={24} />
  <Badge style={{ position: 'absolute', top: -4, right: -4 }}>5</Badge>
</View>
```

### Progress Bar

```javascript
// Indeterminate
<ProgressBar indeterminate />

// Determinate
<ProgressBar progress={0.7} color={theme.colors.primary} />
```

### Activity Indicator

```javascript
<ActivityIndicator animating={true} size="large" />

// With color
<ActivityIndicator animating={true} color={theme.colors.primary} />
```

### Switch

```javascript
<Switch value={isSwitchOn} onValueChange={toggleSwitch} />
```

### Checkbox

```javascript
<Checkbox
  status={checked ? 'checked' : 'unchecked'}
  onPress={() => setChecked(!checked)}
/>

// Indeterminate
<Checkbox status="indeterminate" />
```

### Radio Button

```javascript
<RadioButton
  value="first"
  status={checked === 'first' ? 'checked' : 'unchecked'}
  onPress={() => setChecked('first')}
/>

// Radio Group
<RadioButton.Group onValueChange={setChecked} value={checked}>
  <RadioButton.Item label="First" value="first" />
  <RadioButton.Item label="Second" value="second" />
</RadioButton.Group>
```

### Divider

```javascript
<Divider />

// Bold divider
<Divider bold />

// Horizontal divider (in horizontal scrolls)
<Divider horizontalInset />
```

### Icon

```javascript
<Icon source="camera" size={24} color="#000" />

// Material Community Icons
<Icon source="account-circle" size={48} />
```

### Segmented Buttons

```javascript
<SegmentedButtons
  value={value}
  onValueChange={setValue}
  buttons={[
    { value: 'walk', label: 'Walk' },
    { value: 'train', label: 'Train' },
    { value: 'drive', label: 'Drive' },
  ]}
/>
```

### Surface

```javascript
<Surface style={styles.surface} elevation={4}>
  <Text>Surface</Text>
</Surface>
```

### Tooltip

```javascript
<Tooltip title="Tooltip text">
  <IconButton icon="information" />
</Tooltip>
```

---

## Theme Colors

Access theme colors:

```javascript
import { useTheme } from 'react-native-paper';

const theme = useTheme();

// Available colors
theme.colors.primary
theme.colors.secondary
theme.colors.tertiary
theme.colors.error
theme.colors.background
theme.colors.surface
theme.colors.onPrimary
theme.colors.onSecondary
theme.colors.onBackground
theme.colors.onSurface
theme.colors.outline
```

---

## Common Patterns

### Form with Validation

```javascript
<TextInput mode="outlined" label="Email" error={!!errors.email} />
<HelperText type="error" visible={!!errors.email}>
  {errors.email}
</HelperText>

<Button mode="contained" loading={loading} disabled={loading}>
  Submit
</Button>
```

### Card with Actions

```javascript
<Card>
  <Card.Content>
    <Title>Title</Title>
    <Paragraph>Content</Paragraph>
  </Card.Content>
  <Card.Actions>
    <Button>Cancel</Button>
    <Button mode="contained">Save</Button>
  </Card.Actions>
</Card>
```

### Screen with Appbar and FAB

```javascript
<View style={{ flex: 1 }}>
  <Appbar.Header>
    <Appbar.Content title="Title" />
  </Appbar.Header>
  
  <ScrollView>{/* Content */}</ScrollView>
  
  <FAB icon="plus" style={styles.fab} onPress={handleAdd} />
</View>
```

### List with Search

```javascript
<View>
  <Searchbar
    placeholder="Search"
    value={searchQuery}
    onChangeText={setSearchQuery}
  />
  <FlatList
    data={filteredData}
    renderItem={({ item }) => (
      <List.Item title={item.name} onPress={() => handlePress(item)} />
    )}
  />
</View>
```

---

## Custom Components in This App

Import from `src/components`:

```javascript
import {
  EmptyState,
  LoadingScreen,
  ConfirmDialog,
  SnackbarContainer,
  ActionMenu,
} from '../components';

// Or
import EmptyState from '../components/EmptyState';
```

### EmptyState

```javascript
<EmptyState
  icon="inbox"
  title="No customers yet"
  message="Add your first customer to get started"
  actionLabel="Add Customer"
  onAction={handleAdd}
/>
```

### LoadingScreen

```javascript
<LoadingScreen message="Loading customers..." />
```

### ConfirmDialog

```javascript
<ConfirmDialog
  visible={showDialog}
  title="Delete Customer"
  message="Are you sure?"
  onConfirm={handleDelete}
  onDismiss={hideDialog}
  confirmText="Delete"
  confirmColor="error"
/>
```

### SnackbarContainer

```javascript
const { visible, message, showSnackbar, hideSnackbar } = useSnackbar();

<SnackbarContainer
  visible={visible}
  message={message}
  onDismiss={hideSnackbar}
  variant="success"
/>
```

### ActionMenu

```javascript
<ActionMenu
  items={[
    { title: 'Edit', icon: 'pencil', onPress: handleEdit },
    { title: 'Delete', icon: 'delete', onPress: handleDelete, color: '#f44336' },
  ]}
/>
```

---

## Icons Reference

Popular Material Community Icons:

**Actions:**
- `plus`, `minus`, `close`, `check`, `delete`, `pencil`, `content-save`, `refresh`

**Navigation:**
- `arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`, `menu`, `dots-vertical`, `dots-horizontal`

**UI:**
- `magnify`, `filter`, `sort`, `eye`, `eye-off`, `heart`, `heart-outline`, `star`, `star-outline`

**Objects:**
- `account`, `email`, `phone`, `calendar`, `clock`, `home`, `briefcase`, `cart`, `credit-card`

**Files:**
- `file`, `folder`, `download`, `upload`, `share`, `printer`, `invoice-text-outline`

**Status:**
- `check-circle`, `alert-circle`, `information`, `help-circle`, `shield-check`

Full icon list: https://pictogrammers.com/library/mdi/

---

## Resources

- [Official Docs](https://callstack.github.io/react-native-paper/)
- [Component Showcase](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator)
- [Theming Guide](https://callstack.github.io/react-native-paper/docs/guides/theming)
- [Icon Directory](https://pictogrammers.com/library/mdi/)


