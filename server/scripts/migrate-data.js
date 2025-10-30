const mongoose = require('mongoose');
const { supabase } = require('../config/supabase');
const User = require('../models/User');
const Post = require('../models/Post');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const Conversation = require('../models/Conversation');

// MongoDB 연결
const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(uri);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

// Supabase 연결 테스트
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) throw error;
    console.log('✅ Supabase 연결 성공');
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error.message);
    process.exit(1);
  }
};

// 사용자 데이터 마이그레이션
const migrateUsers = async () => {
  console.log('🔄 사용자 데이터 마이그레이션 시작...');
  
  try {
    const users = await User.find({});
    console.log(`📊 ${users.length}명의 사용자 발견`);

    for (const user of users) {
      const profileData = {
        id: user._id.toString(),
        username: user.username,
        first_name: user.profile?.firstName || null,
        last_name: user.profile?.lastName || null,
        avatar: user.profile?.avatar || null,
        bio: user.profile?.bio || null,
        website: user.profile?.website || null,
        location: user.profile?.location || null,
        github: user.social?.github || null,
        linkedin: user.social?.linkedin || null,
        twitter: user.social?.twitter || null,
        instagram: user.social?.instagram || null,
        role: user.role,
        is_active: user.isActive,
        last_login: user.lastLogin,
        email_verified: user.emailVerified,
        email_verification_token: user.emailVerificationToken,
        email_verification_expires: user.emailVerificationExpires,
        password_reset_token: user.passwordResetToken,
        password_reset_expires: user.passwordResetExpires,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      };

      const { error } = await supabase
        .from('profiles')
        .upsert([profileData], { onConflict: 'id' });

      if (error) {
        console.error(`❌ 사용자 ${user.username} 마이그레이션 실패:`, error.message);
      } else {
        console.log(`✅ 사용자 ${user.username} 마이그레이션 완료`);
      }
    }

    console.log('✅ 사용자 데이터 마이그레이션 완료');
  } catch (error) {
    console.error('❌ 사용자 마이그레이션 오류:', error.message);
  }
};

// 포스트 데이터 마이그레이션
const migratePosts = async () => {
  console.log('🔄 포스트 데이터 마이그레이션 시작...');
  
  try {
    const posts = await Post.find({});
    console.log(`📊 ${posts.length}개의 포스트 발견`);

    for (const post of posts) {
      const postData = {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        tags: post.tags || [],
        featured: post.featured,
        views: post.views,
        likes: post.likes,
        created_at: post.createdAt,
        updated_at: post.updatedAt
      };

      const { error } = await supabase
        .from('posts')
        .upsert([postData], { onConflict: 'id' });

      if (error) {
        console.error(`❌ 포스트 ${post.title} 마이그레이션 실패:`, error.message);
      } else {
        console.log(`✅ 포스트 ${post.title} 마이그레이션 완료`);
      }

      // 댓글 마이그레이션
      if (post.comments && post.comments.length > 0) {
        for (const comment of post.comments) {
          const commentData = {
            post_id: post._id.toString(),
            author: comment.author,
            content: comment.content,
            created_at: comment.createdAt
          };

          const { error: commentError } = await supabase
            .from('comments')
            .insert([commentData]);

          if (commentError) {
            console.error(`❌ 댓글 마이그레이션 실패:`, commentError.message);
          }
        }
      }
    }

    console.log('✅ 포스트 데이터 마이그레이션 완료');
  } catch (error) {
    console.error('❌ 포스트 마이그레이션 오류:', error.message);
  }
};

// 프로젝트 데이터 마이그레이션
const migrateProjects = async () => {
  console.log('🔄 프로젝트 데이터 마이그레이션 시작...');
  
  try {
    const projects = await Project.find({});
    console.log(`📊 ${projects.length}개의 프로젝트 발견`);

    for (const project of projects) {
      const projectData = {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        content: project.content,
        technologies: project.technologies || [],
        images: project.images || [],
        github_url: project.githubUrl,
        live_url: project.liveUrl,
        featured: project.featured,
        category: project.category,
        start_date: project.startDate,
        end_date: project.endDate,
        status: project.status,
        created_at: project.createdAt,
        updated_at: project.updatedAt
      };

      const { error } = await supabase
        .from('projects')
        .upsert([projectData], { onConflict: 'id' });

      if (error) {
        console.error(`❌ 프로젝트 ${project.title} 마이그레이션 실패:`, error.message);
      } else {
        console.log(`✅ 프로젝트 ${project.title} 마이그레이션 완료`);
      }
    }

    console.log('✅ 프로젝트 데이터 마이그레이션 완료');
  } catch (error) {
    console.error('❌ 프로젝트 마이그레이션 오류:', error.message);
  }
};

// 연락처 데이터 마이그레이션
const migrateContacts = async () => {
  console.log('🔄 연락처 데이터 마이그레이션 시작...');
  
  try {
    const contacts = await Contact.find({});
    console.log(`📊 ${contacts.length}개의 연락처 메시지 발견`);

    for (const contact of contacts) {
      const contactData = {
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        ip_address: contact.ipAddress,
        user_agent: contact.userAgent,
        created_at: contact.createdAt,
        updated_at: contact.updatedAt
      };

      const { error } = await supabase
        .from('contacts')
        .upsert([contactData], { onConflict: 'id' });

      if (error) {
        console.error(`❌ 연락처 메시지 마이그레이션 실패:`, error.message);
      } else {
        console.log(`✅ 연락처 메시지 마이그레이션 완료`);
      }
    }

    console.log('✅ 연락처 데이터 마이그레이션 완료');
  } catch (error) {
    console.error('❌ 연락처 마이그레이션 오류:', error.message);
  }
};

// 대화 데이터 마이그레이션
const migrateConversations = async () => {
  console.log('🔄 대화 데이터 마이그레이션 시작...');
  
  try {
    const conversations = await Conversation.find({});
    console.log(`📊 ${conversations.length}개의 대화 발견`);

    for (const conversation of conversations) {
      const conversationData = {
        id: conversation._id.toString(),
        session_id: conversation.sessionId,
        user_id: conversation.userId,
        settings: conversation.settings,
        statistics: conversation.statistics,
        created_at: conversation.createdAt,
        updated_at: conversation.updatedAt
      };

      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .upsert([conversationData], { onConflict: 'id' })
        .select()
        .single();

      if (convError) {
        console.error(`❌ 대화 마이그레이션 실패:`, convError.message);
        continue;
      }

      // 메시지 마이그레이션
      if (conversation.messages && conversation.messages.length > 0) {
        for (const message of conversation.messages) {
          const messageData = {
            conversation_id: newConversation.id,
            message_id: message.id,
            content: message.content,
            is_user: message.isUser,
            timestamp: message.timestamp,
            ai_features: message.aiFeatures,
            metadata: message.metadata,
            response_time: message.responseTime || 0
          };

          const { error: msgError } = await supabase
            .from('messages')
            .insert([messageData]);

          if (msgError) {
            console.error(`❌ 메시지 마이그레이션 실패:`, msgError.message);
          }
        }
      }

      console.log(`✅ 대화 ${conversation.sessionId} 마이그레이션 완료`);
    }

    console.log('✅ 대화 데이터 마이그레이션 완료');
  } catch (error) {
    console.error('❌ 대화 마이그레이션 오류:', error.message);
  }
};

// 메인 마이그레이션 함수
const runMigration = async () => {
  console.log('🚀 MongoDB → Supabase 마이그레이션 시작');
  console.log('=====================================');

  try {
    // 연결 테스트
    await connectMongoDB();
    await testSupabaseConnection();

    // 데이터 마이그레이션
    await migrateUsers();
    await migratePosts();
    await migrateProjects();
    await migrateContacts();
    await migrateConversations();

    console.log('=====================================');
    console.log('🎉 마이그레이션 완료!');
    console.log('이제 Supabase 라우트를 사용할 수 있습니다.');

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message);
  } finally {
    // 연결 종료
    await mongoose.connection.close();
    console.log('📝 MongoDB 연결 종료');
    process.exit(0);
  }
};

// 스크립트 실행
if (require.main === module) {
  runMigration();
}

module.exports = {
  runMigration,
  migrateUsers,
  migratePosts,
  migrateProjects,
  migrateContacts,
  migrateConversations
};
