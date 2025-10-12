# React Native Paper - Component Examples

This guide provides practical examples of how to use React Native Paper components in the Homesteads Viands app.

## Table of Contents

1. [Snackbar (Toast Notifications)](#snackbar)
2. [Dialog (Modals)](#dialog)
3. [Menu (Dropdowns)](#menu)
4. [Checkbox & Radio Buttons](#checkbox-radio)
5. [Switch (Toggles)](#switch)
6. [Bottom Sheet](#bottom-sheet)
7. [Search & Filter](#search-filter)
8. [Lists](#lists)

---

## Snackbar

### Basic Usage

```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import useSnackbar from '../hooks/useSnackbar';
import SnackbarContainer from '../components/SnackbarContainer';

const MyScreen = () => {
  const { visible, message, action, showSnackbar, hideSnackbar } = useSnackbar();

  const handleSave = () => {
    // Save operation...
    showSnackbar('Customer saved successfully!');
  };

  const handleDelete = () => {
    // Delete operation...
    showSnackbar('Customer deleted', {
      label: 'Undo',
      onPress: () => console.log('Undo delete'),
    });
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleSave}>Save</Button>
      <Button onPress={handleDelete}>Delete</Button>
      
      <SnackbarContainer
        visible={visible}
        message={message}
        action={action}
        onDismiss={hideSnackbar}
        variant="success"
      />
    </View>
  );
};
```

### Different Variants

```javascript
// Success
showSnackbar('Operation successful!');
<SnackbarContainer variant="success" />

// Error
showSnackbar('Something went wrong!');
<SnackbarContainer variant="error" />

// Warning
showSnackbar('Please check your input');
<SnackbarContainer variant="warning" />

// Info
showSnackbar('New features available');
<SnackbarContainer variant="info" />
```

---

## Dialog

### Confirmation Dialog

```javascript
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import ConfirmDialog from '../components/ConfirmDialog';

const CustomerListScreen = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleDeletePress = (customer) => {
    setSelectedCustomer(customer);
    setShowDialog(true);
  };

  const handleConfirmDelete = () => {
    // Delete customer logic
    console.log('Deleting customer:', selectedCustomer);
  };

  return (
    <View>
      <Button onPress={() => handleDeletePress(customer)}>
        Delete
      </Button>

      <ConfirmDialog
        visible={showDialog}
        title="Delete Customer"
        message={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onDismiss={() => setShowDialog(false)}
        confirmText="Delete"
        confirmColor="error"
      />
    </View>
  );
};
```

### Custom Dialog

```javascript
import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';

const AddNoteDialog = ({ visible, onDismiss, onSave }) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(note);
    setNote('');
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Add Note</Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            label="Note"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSave}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
```

---

## Menu

### Action Menu (Three Dots)

```javascript
import React from 'react';
import { Card, Title } from 'react-native-paper';
import ActionMenu from '../components/ActionMenu';

const CustomerCard = ({ customer, onEdit, onShare, onDelete }) => {
  const menuItems = [
    {
      title: 'Edit',
      icon: 'pencil',
      onPress: () => onEdit(customer),
    },
    {
      title: 'Share',
      icon: 'share-variant',
      onPress: () => onShare(customer),
    },
    {
      title: 'Delete',
      icon: 'delete',
      onPress: () => onDelete(customer),
      color: '#f44336',
    },
  ];

  return (
    <Card>
      <Card.Content>
        <Title>{customer.name}</Title>
        <ActionMenu items={menuItems} />
      </Card.Content>
    </Card>
  );
};
```

### Custom Anchor Menu

```javascript
import React, { useState } from 'react';
import { Menu, Button } from 'react-native-paper';

const SortMenu = ({ onSort }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button 
          mode="outlined" 
          icon="sort" 
          onPress={() => setVisible(true)}
        >
          Sort
        </Button>
      }
    >
      <Menu.Item
        onPress={() => {
          onSort('name');
          setVisible(false);
        }}
        title="Name"
        leadingIcon="sort-alphabetical-ascending"
      />
      <Menu.Item
        onPress={() => {
          onSort('date');
          setVisible(false);
        }}
        title="Date"
        leadingIcon="sort-calendar-ascending"
      />
      <Menu.Item
        onPress={() => {
          onSort('amount');
          setVisible(false);
        }}
        title="Amount"
        leadingIcon="sort-numeric-ascending"
      />
    </Menu>
  );
};
```

---

## Checkbox & Radio

### Checkbox List

```javascript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, List } from 'react-native-paper';

const FilterDialog = () => {
  const [filters, setFilters] = useState({
    active: true,
    inactive: false,
    pending: false,
  });

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View>
      <List.Item
        title="Active Customers"
        left={() => (
          <Checkbox
            status={filters.active ? 'checked' : 'unchecked'}
            onPress={() => toggleFilter('active')}
          />
        )}
        onPress={() => toggleFilter('active')}
      />
      <List.Item
        title="Inactive Customers"
        left={() => (
          <Checkbox
            status={filters.inactive ? 'checked' : 'unchecked'}
            onPress={() => toggleFilter('inactive')}
          />
        )}
        onPress={() => toggleFilter('inactive')}
      />
    </View>
  );
};
```

### Radio Button Group

```javascript
import React, { useState } from 'react';
import { RadioButton, List } from 'react-native-paper';

const PaymentMethodSelector = () => {
  const [method, setMethod] = useState('card');

  return (
    <RadioButton.Group onValueChange={setMethod} value={method}>
      <List.Item
        title="Credit Card"
        left={() => <RadioButton value="card" />}
        onPress={() => setMethod('card')}
      />
      <List.Item
        title="Cash"
        left={() => <RadioButton value="cash" />}
        onPress={() => setMethod('cash')}
      />
      <List.Item
        title="Bank Transfer"
        left={() => <RadioButton value="transfer" />}
        onPress={() => setMethod('transfer')}
      />
    </RadioButton.Group>
  );
};
```

---

## Switch

### Settings Toggle

```javascript
import React, { useState } from 'react';
import { View } from 'react-native';
import { List, Switch } from 'react-native-paper';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View>
      <List.Item
        title="Push Notifications"
        description="Receive notifications about invoices and customers"
        right={() => (
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        )}
      />
      <List.Item
        title="Dark Mode"
        description="Use dark theme throughout the app"
        right={() => (
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        )}
      />
    </View>
  );
};
```

---

## Search & Filter

### Enhanced Search Bar

```javascript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';

const CustomerListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(['active']);

  const toggleFilter = (filter) => {
    if (filters.includes(filter)) {
      setFilters(filters.filter(f => f !== filter));
    } else {
      setFilters([...filters, filter]);
    }
  };

  return (
    <View>
      <Searchbar
        placeholder="Search customers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.filterContainer}>
        <Chip
          selected={filters.includes('active')}
          onPress={() => toggleFilter('active')}
          style={styles.chip}
        >
          Active
        </Chip>
        <Chip
          selected={filters.includes('inactive')}
          onPress={() => toggleFilter('inactive')}
          style={styles.chip}
        >
          Inactive
        </Chip>
        <Chip
          selected={filters.includes('pending')}
          onPress={() => toggleFilter('pending')}
          style={styles.chip}
        >
          Pending
        </Chip>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    margin: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
});
```

---

## Lists

### Accordion List

```javascript
import React from 'react';
import { List } from 'react-native-paper';

const FAQScreen = () => {
  return (
    <List.AccordionGroup>
      <List.Accordion title="How do I add a customer?" id="1">
        <List.Item title="Tap the + button at the bottom right" />
        <List.Item title="Fill in the customer details" />
        <List.Item title="Tap Create Customer" />
      </List.Accordion>
      
      <List.Accordion title="How do I create an invoice?" id="2">
        <List.Item title="Go to Billing screen" />
        <List.Item title="Tap New Invoice" />
        <List.Item title="Add line items and save" />
      </List.Accordion>
    </List.AccordionGroup>
  );
};
```

### Section List with Icons

```javascript
import React from 'react';
import { List, Divider } from 'react-native-paper';

const ProfileScreen = () => {
  return (
    <>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Profile Settings"
          description="Update your personal information"
          left={props => <List.Icon {...props} icon="account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => console.log('Profile')}
        />
        <List.Item
          title="Security"
          description="Password and authentication"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => console.log('Security')}
        />
      </List.Section>
      
      <Divider />
      
      <List.Section>
        <List.Subheader>Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          description="Manage notification settings"
          left={props => <List.Icon {...props} icon="bell" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => console.log('Notifications')}
        />
      </List.Section>
    </>
  );
};
```

---

## Advanced Examples

### Complete Screen Example

```javascript
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  FAB,
  Searchbar,
  Chip,
} from 'react-native-paper';
import useSnackbar from '../hooks/useSnackbar';
import SnackbarContainer from '../components/SnackbarContainer';
import ConfirmDialog from '../components/ConfirmDialog';
import ActionMenu from '../components/ActionMenu';
import EmptyState from '../components/EmptyState';

const CustomersScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { visible, message, showSnackbar, hideSnackbar } = useSnackbar();

  const handleEdit = (customer) => {
    navigation.navigate('CustomerForm', { customerId: customer.id });
  };

  const handleDeletePress = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // Delete logic
    showSnackbar('Customer deleted successfully');
  };

  const renderCustomer = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.name}</Title>
          <ActionMenu
            items={[
              { title: 'Edit', icon: 'pencil', onPress: () => handleEdit(item) },
              { title: 'Delete', icon: 'delete', onPress: () => handleDeletePress(item), color: '#f44336' },
            ]}
          />
        </View>
        <Paragraph>{item.email}</Paragraph>
        <Chip mode="outlined" style={styles.chip}>
          {item.status}
        </Chip>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Customers" />
      </Appbar.Header>

      <Searchbar
        placeholder="Search customers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {customers.length === 0 ? (
        <EmptyState
          icon="account-group"
          title="No customers yet"
          message="Add your first customer to get started"
          actionLabel="Add Customer"
          onAction={() => navigation.navigate('CustomerForm')}
        />
      ) : (
        <FlatList
          data={customers}
          renderItem={renderCustomer}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CustomerForm')}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Customer"
        message={`Are you sure you want to delete ${selectedCustomer?.name}?`}
        onConfirm={handleConfirmDelete}
        onDismiss={() => setShowDeleteDialog(false)}
        confirmText="Delete"
        confirmColor="error"
      />

      <SnackbarContainer
        visible={visible}
        message={message}
        onDismiss={hideSnackbar}
        variant="success"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CustomersScreen;
```

---

## Tips & Best Practices

1. **Portal for Dialogs**: Always wrap Dialogs in `<Portal>` for proper z-index handling
2. **Snackbar Position**: Place Snackbar at the end of the component tree
3. **Menu Anchors**: Use IconButton or Button as anchors for cleaner code
4. **List Performance**: Use FlatList for long lists with Paper components
5. **Theme Colors**: Access theme colors via `useTheme()` hook
6. **Accessibility**: Paper components include built-in accessibility support
7. **Icons**: Use Material Community Icons names from: https://pictogrammers.com/library/mdi/

---

## Component Combinations

### Card with Menu

```javascript
<Card>
  <Card.Content>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Title>Customer Name</Title>
      <ActionMenu items={menuItems} />
    </View>
  </Card.Content>
</Card>
```

### Search with Filters

```javascript
<View>
  <Searchbar />
  <View style={{ flexDirection: 'row' }}>
    <Chip selected={filter === 'all'}>All</Chip>
    <Chip selected={filter === 'active'}>Active</Chip>
  </View>
</View>
```

### List with Actions

```javascript
<List.Item
  title="Item"
  right={() => (
    <View style={{ flexDirection: 'row' }}>
      <IconButton icon="pencil" onPress={handleEdit} />
      <IconButton icon="delete" onPress={handleDelete} />
    </View>
  )}
/>
```

