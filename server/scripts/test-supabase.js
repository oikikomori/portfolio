const supabaseService = require('../services/supabaseService');
const { testConnection } = require('../config/supabase');

// 테스트 데이터
const testData = {
  profile: {
    username: 'testuser',
    first_name: '테스트',
    last_name: '사용자',
    bio: '테스트용 프로필입니다.',
    role: 'user'
  },
  post: {
    title: 'Supabase 테스트 포스트',
    content: '이것은 Supabase 마이그레이션 테스트용 포스트입니다.',
    author: 'testuser',
    category: 'tech',
    tags: ['test', 'supabase', 'migration'],
    featured: true
  },
  project: {
    title: 'Supabase 테스트 프로젝트',
    description: 'Supabase 마이그레이션을 위한 테스트 프로젝트',
    content: '이 프로젝트는 Supabase 마이그레이션 테스트를 위해 생성되었습니다.',
    technologies: ['Node.js', 'Supabase', 'PostgreSQL'],
    category: 'web',
    status: 'completed'
  },
  contact: {
    name: '테스트 사용자',
    email: 'test@example.com',
    subject: 'Supabase 테스트',
    message: 'Supabase 마이그레이션 테스트 메시지입니다.'
  }
};

// 연결 테스트
const testSupabaseConnection = async () => {
  console.log('🔌 Supabase 연결 테스트...');
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Supabase 연결 성공');
    return true;
  } else {
    console.log('❌ Supabase 연결 실패');
    return false;
  }
};

// 프로필 테스트
const testProfile = async () => {
  console.log('👤 프로필 테스트...');
  
  try {
    // 프로필 생성
    const profile = await supabaseService.createProfile({
      id: 'test-user-id',
      ...testData.profile
    });
    console.log('✅ 프로필 생성 성공');

    // 프로필 조회
    const retrievedProfile = await supabaseService.getProfile(profile.id);
    console.log('✅ 프로필 조회 성공');

    // 프로필 업데이트
    const updatedProfile = await supabaseService.updateProfile(profile.id, {
      bio: '업데이트된 테스트 프로필입니다.'
    });
    console.log('✅ 프로필 업데이트 성공');

    return true;
  } catch (error) {
    console.error('❌ 프로필 테스트 실패:', error.message);
    return false;
  }
};

// 포스트 테스트
const testPosts = async () => {
  console.log('📝 포스트 테스트...');
  
  try {
    // 포스트 생성
    const post = await supabaseService.createPost(testData.post);
    console.log('✅ 포스트 생성 성공');

    // 포스트 조회
    const retrievedPost = await supabaseService.getPost(post.id);
    console.log('✅ 포스트 조회 성공');

    // 포스트 목록 조회
    const posts = await supabaseService.getPosts({ limit: 10 });
    console.log('✅ 포스트 목록 조회 성공');

    // 조회수 증가
    await supabaseService.incrementViews(post.id);
    console.log('✅ 조회수 증가 성공');

    // 댓글 추가
    const comment = await supabaseService.createComment({
      post_id: post.id,
      author: '댓글 작성자',
      content: '테스트 댓글입니다.'
    });
    console.log('✅ 댓글 추가 성공');

    return true;
  } catch (error) {
    console.error('❌ 포스트 테스트 실패:', error.message);
    return false;
  }
};

// 프로젝트 테스트
const testProjects = async () => {
  console.log('🚀 프로젝트 테스트...');
  
  try {
    // 프로젝트 생성
    const project = await supabaseService.createProject(testData.project);
    console.log('✅ 프로젝트 생성 성공');

    // 프로젝트 조회
    const retrievedProject = await supabaseService.getProject(project.id);
    console.log('✅ 프로젝트 조회 성공');

    // 프로젝트 목록 조회
    const projects = await supabaseService.getProjects({ limit: 10 });
    console.log('✅ 프로젝트 목록 조회 성공');

    return true;
  } catch (error) {
    console.error('❌ 프로젝트 테스트 실패:', error.message);
    return false;
  }
};

// 연락처 테스트
const testContacts = async () => {
  console.log('📧 연락처 테스트...');
  
  try {
    // 연락처 메시지 생성
    const contact = await supabaseService.createContact(testData.contact);
    console.log('✅ 연락처 메시지 생성 성공');

    // 연락처 목록 조회
    const contacts = await supabaseService.getContacts({ limit: 10 });
    console.log('✅ 연락처 목록 조회 성공');

    // 상태 업데이트
    await supabaseService.updateContactStatus(contact.id, 'read');
    console.log('✅ 연락처 상태 업데이트 성공');

    return true;
  } catch (error) {
    console.error('❌ 연락처 테스트 실패:', error.message);
    return false;
  }
};

// 대화 테스트
const testConversations = async () => {
  console.log('💬 대화 테스트...');
  
  try {
    const sessionId = 'test-session-' + Date.now();
    const userId = 'test-user';

    // 대화 생성
    const conversation = await supabaseService.getOrCreateConversation(sessionId, userId);
    console.log('✅ 대화 생성 성공');

    // 메시지 추가
    const userMessage = {
      id: 'msg-1',
      content: '안녕하세요!',
      isUser: true,
      timestamp: new Date()
    };
    await supabaseService.addMessage(sessionId, userMessage);
    console.log('✅ 사용자 메시지 추가 성공');

    const aiMessage = {
      id: 'msg-2',
      content: '안녕하세요! 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date(),
      aiFeatures: {
        tone: '친근하게',
        emotion: '긍정적',
        intent: '인사',
        confidence: 0.9
      }
    };
    await supabaseService.addMessage(sessionId, aiMessage);
    console.log('✅ AI 메시지 추가 성공');

    // 대화 히스토리 조회
    const history = await supabaseService.getConversationHistory(sessionId);
    console.log('✅ 대화 히스토리 조회 성공');

    return true;
  } catch (error) {
    console.error('❌ 대화 테스트 실패:', error.message);
    return false;
  }
};

// 검색 테스트
const testSearch = async () => {
  console.log('🔍 검색 테스트...');
  
  try {
    // 포스트 검색
    const posts = await supabaseService.searchPosts('테스트');
    console.log('✅ 포스트 검색 성공');

    // 프로젝트 검색
    const projects = await supabaseService.searchProjects('Supabase');
    console.log('✅ 프로젝트 검색 성공');

    return true;
  } catch (error) {
    console.error('❌ 검색 테스트 실패:', error.message);
    return false;
  }
};

// 통계 테스트
const testStats = async () => {
  console.log('📊 통계 테스트...');
  
  try {
    // 포스트 수
    const postCount = await supabaseService.getCount('posts');
    console.log(`✅ 포스트 수: ${postCount}`);

    // 프로젝트 수
    const projectCount = await supabaseService.getCount('projects');
    console.log(`✅ 프로젝트 수: ${projectCount}`);

    // 연락처 수
    const contactCount = await supabaseService.getCount('contacts');
    console.log(`✅ 연락처 수: ${contactCount}`);

    return true;
  } catch (error) {
    console.error('❌ 통계 테스트 실패:', error.message);
    return false;
  }
};

// 전체 테스트 실행
const runAllTests = async () => {
  console.log('🧪 Supabase 기능 테스트 시작');
  console.log('=====================================');

  const tests = [
    { name: '연결 테스트', fn: testSupabaseConnection },
    { name: '프로필 테스트', fn: testProfile },
    { name: '포스트 테스트', fn: testPosts },
    { name: '프로젝트 테스트', fn: testProjects },
    { name: '연락처 테스트', fn: testContacts },
    { name: '대화 테스트', fn: testConversations },
    { name: '검색 테스트', fn: testSearch },
    { name: '통계 테스트', fn: testStats }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n🔄 ${test.name} 실행 중...`);
    const result = await test.fn();
    
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n=====================================');
  console.log(`📊 테스트 결과: ${passed}개 성공, ${failed}개 실패`);
  
  if (failed === 0) {
    console.log('🎉 모든 테스트가 성공했습니다!');
    console.log('Supabase 마이그레이션이 완료되었습니다.');
  } else {
    console.log('⚠️ 일부 테스트가 실패했습니다. 설정을 확인해주세요.');
  }

  process.exit(failed === 0 ? 0 : 1);
};

// 스크립트 실행
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testSupabaseConnection,
  testProfile,
  testPosts,
  testProjects,
  testContacts,
  testConversations,
  testSearch,
  testStats
};
