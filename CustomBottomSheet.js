import React, { useRef, useEffect } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { height, width } = Dimensions.get('window');

const CustomBottomSheet = ({ 
  isVisible, 
  onClose, 
  restaurant,
  menuItems = [
    {
      id: '1',
      name: 'Signature Burger',
      price: '$12.99',
      description: 'Angus beef patty, caramelized onions, special sauce',
      image: require('../screens/user1.jpg'), // Use actual food images in production
      isBestseller: true,
    },
    {
      id: '2',
      name: 'Truffle Fries',
      price: '$7.99',
      description: 'Hand-cut fries with truffle oil and parmesan',
      image: require('../screens/user1.jpg'), // Use actual food images in production
      isBestseller: false,
    },
    {
      id: '3',
      name: 'Avocado Salad',
      price: '$9.99',
      description: 'Fresh greens, avocado, cherry tomatoes, balsamic',
      image: require('../screens/user1.jpg'), // Use actual food images in production
      isBestseller: false,
    }
  ]
}) => {
  const bottomSheetHeight = height * 0.7;
  const translateY = useRef(new Animated.Value(bottomSheetHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Fade in background overlay
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Slide up bottom sheet
      Animated.spring(translateY, {
        toValue: 0,
        tension: 70,
        friction: 12,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out background overlay
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Slide down bottom sheet
      Animated.timing(translateY, {
        toValue: bottomSheetHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, bottomSheetHeight]);

  const handleAddToCart = (item) => {
    // Implement cart functionality here
    console.log('Added to cart:', item.name);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Backdrop overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { 
            height: bottomSheetHeight,
            transform: [{ translateY }],
          }
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handle}>
          <View style={styles.handleBar} />
        </View>

        {/* Restaurant Header */}
        <View style={styles.restaurantHeader}>
          <Image 
            source={restaurant.icon} 
            style={styles.restaurantImage} 
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.restaurantMetaInfo}>
              <Icon name="map-pin" size={14} color="#777" />
              <Text style={styles.locationText}>{restaurant.location}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#FFCC00" />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="x" size={22} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Delivery Status */}
        <View style={styles.deliveryInfoContainer}>
          <View style={styles.deliveryInfo}>
            <Icon name="clock" size={16} color="#FF3D44" />
            <Text style={styles.deliveryText}>25-35 min</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.deliveryInfo}>
            <Icon name="truck" size={16} color="#FF3D44" />
            <Text style={styles.deliveryText}>Free Delivery</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.deliveryInfo}>
            <Icon name="check-circle" size={16} color="#FF3D44" />
            <Text style={styles.deliveryText}>4.8 (1.2k reviews)</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <ScrollView style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          
          {menuItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <Image source={item.image} style={styles.menuItemImage} />
              <View style={styles.menuItemInfo}>
                <View style={styles.menuItemHeader}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  {item.isBestseller && (
                    <View style={styles.bestsellerBadge}>
                      <Text style={styles.bestsellerText}>Bestseller</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <View style={styles.menuItemBottom}>
                  <Text style={styles.menuItemPrice}>{item.price}</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Icon name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Order Button */}
        <View style={styles.orderButtonContainer}>
          <TouchableOpacity style={styles.orderButton}>
            <Icon name="shopping-bag" size={18} color="white" style={styles.orderButtonIcon} />
            <Text style={styles.orderButtonText}>Start Order</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  restaurantMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#777777',
    marginLeft: 4,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222222',
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#EEEEEE',
  },
  menuContainer: {
    flex: 1,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },
  bestsellerBadge: {
    backgroundColor: '#FFF9E6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bestsellerText: {
    fontSize: 10,
    color: '#FFCC00',
    fontWeight: '600',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#777777',
    lineHeight: 18,
    marginBottom: 8,
  },
  menuItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },
  addButton: {
    backgroundColor: '#FF3D44',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButtonContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  orderButton: {
    backgroundColor: '#FF3D44',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButtonIcon: {
    marginRight: 8,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomBottomSheet;
