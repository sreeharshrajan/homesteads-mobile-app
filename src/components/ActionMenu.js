import React, { useState } from 'react';
import { Menu, IconButton } from 'react-native-paper';

/**
 * Reusable action menu component
 *
 * Usage:
 * <ActionMenu
 *   items={[
 *     { title: 'Edit', icon: 'pencil', onPress: handleEdit },
 *     { title: 'Share', icon: 'share', onPress: handleShare },
 *     { title: 'Delete', icon: 'delete', onPress: handleDelete, color: '#f44336' },
 *   ]}
 * />
 */
const ActionMenu = ({ items, icon = 'dots-vertical', anchorStyle = {} }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleItemPress = (onPress) => {
    closeMenu();
    onPress();
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<IconButton icon={icon} size={24} onPress={openMenu} style={anchorStyle} />}
    >
      {items.map((item, index) => (
        <Menu.Item
          key={index}
          onPress={() => handleItemPress(item.onPress)}
          title={item.title}
          leadingIcon={item.icon}
          titleStyle={item.color ? { color: item.color } : undefined}
        />
      ))}
    </Menu>
  );
};

export default ActionMenu;
