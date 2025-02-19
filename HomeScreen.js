import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import CustomBottomSheet from '../components/CustomBottomSheet'; // Import the custom bottom sheet
import Fav from '../../assets/svg/svgnew/Fav';
import { s } from 'react-native-wind';


const { height, width } = Dimensions.get('window');

// https://res.cloudinary.com/dityjpdl6/video/upload/v1739648974/knf9kh8sbqhyhj5kxipn.mp4

const reelsData = [
  {
    id: '1',
    videoUrl: "https://res.cloudinary.com/dityjpdl6/video/upload/v1739964303/mdaqdcmku37txqzbt21f.mp4",
    user: {
      name: 'John Doe',
      picture: require('./user1.jpg'),
      rating: 4.5,
      followers: '12.5K',
    },
    restaurant: {
      name: 'Food Haven',
      icon: require('./user1.jpg'),
      location: 'New York, USA',
      rating: 4.8,
      deliveryTime: 'Order Now',
    },
    stats: {
      upvotes: '1.2K',
      reviews: 340,
      saves: '850', // Changed from shares to saves
    },
    content: {
      tags: ['#Travel', '#Food', '#Adventure'],
      description: 'Exploring the best food in town! 🍔🌮',
      specialOffer: '20% OFF on first order!',
    }
  },
  
];

const HomeScreen = ({navigation}) => {
  const [pausedState, setPausedState] = useState({});
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const togglePlayPause = (id) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    setPausedState(prev => ({...prev, [id]: !prev[id]}));
  };

  const openBottomSheet = (restaurant) => {
    // Pause the video when opening bottom sheet
    const newPausedState = {...pausedState};
    Object.keys(newPausedState).forEach(id => {
      newPausedState[id] = true;
    });
    setPausedState(newPausedState);
    
    setSelectedRestaurant(restaurant);
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => togglePlayPause(item.id)}>
      <View style={styles.reelContainer}>
        <Video
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={pausedState[item.id]}
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.appName}>FoodReels</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="bell" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="shopping-cart" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate("ChatScreen")}
                style={styles.messageButton}
              >
                <Icon name="message-circle" size={20} color="white" />
                <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
              </TouchableOpacity>
            </View>
          </View>
  
          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.userContainer}>
              <Image source={item.user.picture} style={styles.userImage} />
              <View style={styles.userInfo}>
                <View style={s`flex flex-row`}>
                <Text style={styles.userName}>{item.user.name}</Text>
                 {/* Follow Button */}
              <TouchableOpacity style={[styles.followerBadge,s`ml-3`]}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
                </View>
               
                {/* Location under the username */}
                <View style={styles.locationContainer}>
                  <Icon name="map-pin" size={12} color="white" />
                  <Text style={styles.locationText}>{item.restaurant.location}</Text>
                </View>
              </View>
             
            </View>
  
            <Text style={styles.description}>{item.content.description}</Text>
            
            {item.content.specialOffer && (
              <TouchableOpacity style={styles.offerBadge}>
                <Icon name="gift" size={14} color="white" />
                <Text style={styles.offerText}>{item.content.specialOffer}</Text>
              </TouchableOpacity>
            )}
  
            <View style={styles.tagContainer}>
              {item.content.tags.map((tag, index) => (
                <View key={index} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
  
          {/* Right Action Bar */}
          <View style={styles.actionBar}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openBottomSheet(item.restaurant)}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Icon name="shopping-bag" size={24} color="white" />
              </Animated.View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCount}>Order!</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.actionButton}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Fav size={24} color="white" />
              </Animated.View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCount}>{item.stats.upvotes}</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="message-circle" size={24} color="white" />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCount}>{item.stats.reviews}</Text>
                <Text style={styles.actionLabel}>Reviews</Text>
              </View>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="bookmark" size={24} color="white" />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCount}>{item.stats.saves}</Text>
                <Text style={styles.actionLabel}>Saves</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={reelsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => {
          const newPausedState = {};
          reelsData.forEach(item => newPausedState[item.id] = true);
          viewableItems.forEach(({ item }) => newPausedState[item.id] = false);
          setPausedState(newPausedState);
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      
      {/* Custom Bottom Sheet */}
      {selectedRestaurant && (
        <CustomBottomSheet
          isVisible={bottomSheetVisible}
          onClose={closeBottomSheet}
          restaurant={selectedRestaurant}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles remain unchanged
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    height: height,
    width: width,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  messageButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3D44',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  restaurantButton: {
    alignSelf: 'flex-start',
    position: 'relative',
    marginBottom: 20, // Added margin bottom
  },
  restaurantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  restaurantBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#FF3D44',
    borderRadius: 10,
    paddingHorizontal: 6,
    height: 20,
    justifyContent: 'center',
  },
  restaurantBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    marginBottom: 60,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FF3D44',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginRight: 6,
  },
  followerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 6,
    height: 18,
    justifyContent: 'center',
  },
  followerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: 'white',
    lineHeight: 18,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  offerBadge: {
    backgroundColor: '#FF3D44',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  offerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  actionBar: {
    position: 'absolute',
    right: 12,
    bottom: 60,
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  actionTextContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  actionCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  

  // 

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    marginBottom: 12,
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FF3D44',
  },
  userInfo: {
    flexDirection: 'column', // Stack username and location vertically
    justifyContent: 'center', // Center content vertically
    marginRight: 8, // Add some space between user info and follow button
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // Space between username and location
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: '#FF3D44',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center', // Center the button vertically
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
