const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || 'https://test.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'test-anon-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.log('⚠️ Supabase 환경변수가 설정되지 않았습니다.');
  console.log('SUPABASE_URL과 SUPABASE_ANON_KEY를 설정해주세요.');
  console.log('테스트용 더미 키를 사용합니다.');
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️ Supabase 연결을 건너뜁니다. 환경변수를 설정해주세요.');
      return false;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase 연결 실패:', error.message);
      return false;
    }

    console.log('✅ Supabase 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ Supabase 연결 오류:', error.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
