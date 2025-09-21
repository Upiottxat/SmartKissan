import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
interface Post {
  id: number;
  author: string;
  location: string;
  expertise: string;
  verified: boolean;
  avatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  helpful: number;
  tags: string[];
  isQuestion?: boolean;
  isProfessional?: boolean;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Rajesh Kumar',
      location: 'Punjab',
      expertise: 'Rice Expert',
      verified: true,
      avatar: 'RK',
      timeAgo: '2 hours ago',
      content:
        'Great harvest this season! Here are some tips for post-harvest storage to prevent pest damage. Keep grain moisture below 14% and use neem oil treatment.',
      image: '🌾',
      likes: 24,
      comments: 8,
      helpful: 15,
      tags: ['harvest', 'storage', 'pest-control'],
    },
    {
      id: 2,
      author: 'Priya Sharma',
      location: 'Haryana',
      expertise: 'Organic Farming',
      verified: true,
      avatar: 'PS',
      timeAgo: '4 hours ago',
      content:
        'My tomato plants are showing these spots. Any organic solutions? Avoiding chemical pesticides as we\'re certified organic.',
      image: '🍅',
      likes: 12,
      comments: 15,
      helpful: 8,
      tags: ['organic', 'disease', 'tomato'],
      isQuestion: true,
    },
    {
      id: 3,
      author: 'Dr. Amit Verma',
      location: 'IARI, New Delhi',
      expertise: 'Plant Pathologist',
      verified: true,
      avatar: 'AV',
      timeAgo: '6 hours ago',
      content:
        'Weather update: Heavy rains expected next week in North India. Prepare drainage systems and avoid nitrogen application before rains to prevent lodging.',
      likes: 45,
      comments: 22,
      helpful: 30,
      tags: ['weather', 'advisory', 'drainage'],
      isProfessional: true,
    },
  ]);

  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Posts', count: posts.length },
    { id: 'questions', label: 'Questions', count: posts.filter(p => p.isQuestion).length },
    { id: 'experts', label: 'Expert Tips', count: posts.filter(p => p.isProfessional).length },
    { id: 'following', label: 'Following', count: 12 },
  ];

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'questions') return post.isQuestion;
    if (filter === 'experts') return post.isProfessional;
    if (filter === 'following') return post.verified;
    return true;
  });

  const handleLike = (postId: number) => {
    setPosts(prev =>
      prev.map(post => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
    );
  };

  const handleHelpful = (postId: number) => {
    setPosts(prev =>
      prev.map(post => (post.id === postId ? { ...post, helpful: post.helpful + 1 } : post))
    );
  };

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View
            style={[
              styles.avatar,
              post.isProfessional ? styles.avatarProfessional : styles.avatarRegular,
            ]}
          >
            <Text style={styles.avatarText}>{post.avatar}</Text>
          </View>
          <View style={styles.authorDetails}>
            <View style={styles.authorName}>
              <Text style={styles.authorNameText}>{post.author}</Text>
              {post.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#2196F3" />
              )}
              {post.isProfessional && (
                <Ionicons name="star" size={16} color="#FF9800" />
              )}
            </View>
            <View style={styles.authorMeta}>
              <Text style={styles.expertise}>{post.expertise}</Text>
              <Text style={styles.metaSeparator}>•</Text>
              <Ionicons name="location-outline" size={12} color="#666" />
              <Text style={styles.location}>{post.location}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.contentText}>{post.content}</Text>

        {post.image && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageIcon}>{post.image}</Text>
            <Text style={styles.imageCaption}>Tap to view image</Text>
          </View>
        )}

        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.postMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#666" />
            <Text style={styles.metaText}>{post.timeAgo}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="thumbs-up-outline" size={12} color="#666" />
            <Text style={styles.metaText}>{post.helpful} found helpful</Text>
          </View>
        </View>

        <View style={styles.postActions}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(post.id)}
            >
              <Ionicons name="heart-outline" size={18} color="#666" />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={18} color="#666" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={18} color="#666" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.helpfulButton}
            onPress={() => handleHelpful(post.id)}
          >
            <Ionicons name="thumbs-up-outline" size={14} color="#4CAF50" />
            <Text style={styles.helpfulButtonText}>Helpful</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Community</Text>
          <TouchableOpacity style={styles.postButton}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map(filterOption => (
            <TouchableOpacity
              key={filterOption.id}
              style={[
                styles.filterTab,
                filter === filterOption.id && styles.filterTabActive,
              ]}
              onPress={() => setFilter(filterOption.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === filterOption.id && styles.filterTabTextActive,
                ]}
              >
                {filterOption.label}
              </Text>
              <View style={styles.filterCount}>
                <Text style={styles.filterCountText}>{filterOption.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContainer}
      />

      {/* Quick Help Section */}
      <View style={styles.quickHelpContainer}>
        <View style={styles.quickHelpContent}>
          <Text style={styles.quickHelpIcon}>💡</Text>
          <View style={styles.quickHelpInfo}>
            <Text style={styles.quickHelpTitle}>Need immediate help?</Text>
            <Text style={styles.quickHelpSubtitle}>
              Get instant advice from verified experts
            </Text>
            <TouchableOpacity style={styles.quickHelpButton}>
              <Text style={styles.quickHelpButtonText}>Ask Expert Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  postButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  filtersContainer: {
    flexDirection: 'row',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: '#4CAF50',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  filterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666',
  },
  postsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarRegular: {
    backgroundColor: '#E8F5E8',
  },
  avatarProfessional: {
    backgroundColor: '#E3F2FD',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  expertise: {
    fontSize: 12,
    color: '#666',
  },
  metaSeparator: {
    fontSize: 12,
    color: '#666',
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 12,
  },
  imageIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imageCaption: {
    fontSize: 10,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 4,
  },
  helpfulButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  quickHelpContainer: {
    margin: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  quickHelpContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  quickHelpIcon: {
    fontSize: 32,
  },
  quickHelpInfo: {
    flex: 1,
  },
  quickHelpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  quickHelpSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  quickHelpButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  quickHelpButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2196F3',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});