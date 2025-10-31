// 서버 사이드 전용 Supabase 클라이언트
// API Route에서 사용할 때는 Service Role Key를 사용합니다
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 서버 사이드에서는 Service Role Key를 우선 사용
// 없으면 Anon Key 사용 (RLS 정책에 따라 작동)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('필수: NEXT_PUBLIC_SUPABASE_URL');
  console.error('서버 사이드 권장: SUPABASE_SERVICE_ROLE_KEY');
  console.error('대체: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

