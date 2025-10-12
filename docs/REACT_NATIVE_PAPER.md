# React Native Paper Implementation Guide

## Overview

React Native Paper is fully integrated into the Homesteads Viands mobile app, providing a Material Design 3 (Material You) UI framework.

## Configuration

### Theme Setup

The app uses a custom theme defined in `src/config/theme.js`:

```javascript
import { lightTheme, darkTheme } from './src/config/theme';
```

**Custom Colors:**
- **Primary**: `#2e7d32` (Green) - Food/fresh theme
- **Secondary**: `#ff6f00` (Orange) - Accent color
- **Tertiary**: `#1976d2` (Blue) - Additional accent

### Provider Setup

The `PaperProvider` wraps the entire app in `App.js`:

```javascript
<PaperProvider theme={lightTheme}>
  <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.primary} />
  <AppNavigator />
</PaperProvider>
```

## Components Used

### Navigation Components
- **Appbar.Header** - Screen headers with actions
- **Appbar.BackAction** - Back navigation button
- **Appbar.Content** - Header title
- **Appbar.Action** - Header action buttons

### Form Components
- **TextInput** - Text input fields (mode: "outlined")
- **Button** - Action buttons (modes: "contained", "outlined", "text")
- **SegmentedButtons** - Toggle between options
- **HelperText** - Form validation messages
- **Searchbar** - Search input with icon

### Display Components
- **Card** - Container for grouped content
- **Title** - Large text headers
- **Paragraph** - Body text
- **Text** - General text component
- **Chip** - Small status indicators
- **Divider** - Visual separator
- **DataTable** - Tabular data display
- **Icon** - Material icons

### Feedback Components
- **ActivityIndicator** - Loading spinner
- **FAB** (Floating Action Button) - Primary action button
- **Snackbar** - Toast notifications (not yet implemented)

## Screen Examples

### Login Screen
Uses Paper's TextInput, Button, Title, and HelperText components with form validation.

### Customer List Screen
Features Appbar, Searchbar, Card, Chip, and FAB components for a rich list experience.

### Billing Screen
Displays billing data using Card, Chip with custom colors, and FAB for new invoices.

### Invoice Screen
Uses DataTable for line items and structured Card layout for invoice details.

### Customer Form Screen
Implements TextInput fields, SegmentedButtons for status, and validation with HelperText.

## Best Practices

### 1. Theme Integration
Access theme colors in styles:
```javascript
import { useTheme } from 'react-native-paper';

const theme = useTheme();
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
});
```

### 2. Button Modes
- **contained** - Primary actions (filled button)
- **outlined** - Secondary actions (bordered button)
- **text** - Tertiary actions (flat button)
- **elevated** - Raised button with shadow

### 3. TextInput Modes
- **outlined** - Recommended for forms (currently used)
- **flat** - Alternative style with underline

### 4. Icon Usage
Paper uses Material Community Icons by default through Expo:
```javascript
<Icon source="account" size={24} />
<Button icon="plus">Add</Button>
<FAB icon="pencil" />
<Appbar.Action icon="logout" />
```

### 5. Accessibility
Paper components come with built-in accessibility:
- Proper touch target sizes
- Screen reader support
- Keyboard navigation
- High contrast support

## Components to Implement

### Recommended Additions

1. **Snackbar** - For success/error notifications
```javascript
<Snackbar
  visible={visible}
  onDismiss={() => setVisible(false)}
  action={{ label: 'Undo', onPress: () => {} }}
>
  Customer saved successfully!
</Snackbar>
```

2. **Dialog** - For confirmations
```javascript
<Dialog visible={visible} onDismiss={hideDialog}>
  <Dialog.Title>Delete Customer</Dialog.Title>
  <Dialog.Content>
    <Text>Are you sure you want to delete this customer?</Text>
  </Dialog.Content>
  <Dialog.Actions>
    <Button onPress={hideDialog}>Cancel</Button>
    <Button onPress={confirmDelete}>Delete</Button>
  </Dialog.Actions>
</Dialog>
```

3. **Menu** - For dropdown actions
```javascript
<Menu
  visible={visible}
  onDismiss={closeMenu}
  anchor={<Button onPress={openMenu}>Show menu</Button>}
>
  <Menu.Item onPress={() => {}} title="Edit" />
  <Menu.Item onPress={() => {}} title="Delete" />
</Menu>
```

4. **Checkbox/RadioButton** - For selections
```javascript
<Checkbox
  status={checked ? 'checked' : 'unchecked'}
  onPress={() => setChecked(!checked)}
/>
```

5. **Switch** - For toggles
```javascript
<Switch value={enabled} onValueChange={setEnabled} />
```

## Styling Guidelines

### Consistent Spacing
- Padding: 16px standard, 8px compact
- Margins: 16px between major sections, 8px between related items
- Border radius: 8px (theme.roundness)

### Typography
Paper provides consistent typography:
```javascript
import { Text } from 'react-native-paper';

<Text variant="displayLarge">Display Large</Text>
<Text variant="displayMedium">Display Medium</Text>
<Text variant="displaySmall">Display Small</Text>
<Text variant="headlineLarge">Headline Large</Text>
<Text variant="titleLarge">Title Large</Text>
<Text variant="bodyLarge">Body Large</Text>
<Text variant="labelMedium">Label Medium</Text>
```

### Colors
Use theme colors instead of hardcoded values:
```javascript
const theme = useTheme();

style={{
  color: theme.colors.primary,
  backgroundColor: theme.colors.surface,
  borderColor: theme.colors.outline,
}}
```

## Dark Mode Support

The app includes both light and dark themes. To implement theme switching:

```javascript
import { useState } from 'react';
import { lightTheme, darkTheme } from './src/config/theme';

const [isDark, setIsDark] = useState(false);
const theme = isDark ? darkTheme : lightTheme;

<PaperProvider theme={theme}>
  {/* App content */}
</PaperProvider>
```

## Icon Reference

Common Material Community Icons used in the app:
- `plus` - Add/Create
- `pencil` - Edit
- `delete` - Delete
- `magnify` - Search
- `logout` - Sign out
- `account` - User profile
- `invoice-text-outline` - Billing/Invoices
- `download` - Download/Export
- `check` - Confirm/Success
- `close` - Cancel/Close
- `arrow-left` - Back navigation
- `dots-vertical` - More options menu
- `filter` - Filter options
- `sort` - Sort options

Find more icons at: https://pictogrammers.com/library/mdi/

## Resources

- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Icons](https://pictogrammers.com/library/mdi/)
- [Expo Vector Icons](https://icons.expo.fyi/)

## Migration Checklist

✅ Install react-native-paper
✅ Set up PaperProvider with custom theme
✅ Implement custom theme with brand colors
✅ Update LoginScreen with Paper components
✅ Update CustomerListScreen with Paper components
✅ Update CustomerFormScreen with Paper components
✅ Update BillingScreen with Paper components
✅ Update InvoiceScreen with Paper components
✅ Update LoadingScreen with Paper components
✅ Update EmptyState with Paper components
✅ Add LoadingScreen to AppNavigator
✅ Create theme configuration file

## Next Steps

1. **Add Snackbar notifications** for user feedback
2. **Implement Dialog components** for confirmations
3. **Add Menu components** for action sheets
4. **Implement theme switching** for dark mode
5. **Add animated transitions** between screens
6. **Implement pull-to-refresh** with Paper styling
7. **Add bottom sheet** for mobile actions
8. **Implement drawer navigation** if needed


