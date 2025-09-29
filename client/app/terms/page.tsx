import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>최종 수정일:</strong> 2024년 9월 29일
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                이 약관은 okuma 포트폴리오 웹사이트(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제2조 (정의)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                이 약관에서 사용하는 용어의 정의는 다음과 같습니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li><strong>"서비스"</strong>란 okuma의 포트폴리오를 소개하는 웹사이트를 의미합니다.</li>
                <li><strong>"이용자"</strong>란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
                <li><strong>"콘텐츠"</strong>란 이용자가 서비스를 이용하면서 생성한 정보, 텍스트, 이미지 등을 의미합니다.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제3조 (약관의 효력 및 변경)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2. 서비스는 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경된 약관의 내용과 시행일을 정하여, 
                시행일로부터 최소 7일 이전에 공지합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제4조 (서비스의 제공)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                서비스는 다음과 같은 업무를 수행합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>포트폴리오 정보 제공</li>
                <li>프로젝트 소개</li>
                <li>연락처 문의 처리</li>
                <li>기타 서비스와 관련된 업무</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제5조 (서비스의 중단)</h2>
              <p className="text-gray-700 leading-relaxed">
                서비스는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 
                서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 서비스는 제9조에 정한 방법으로 이용자에게 통지합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제6조 (이용자의 의무)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                이용자는 다음 행위를 하여서는 안 됩니다:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>신청 또는 변경시 허위 내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>서비스에 게시된 정보의 변경</li>
                <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>서비스 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>서비스 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제7조 (저작권의 귀속 및 이용제한)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                1. 서비스가 작성한 저작물에 대한 저작권 기타 지적재산권은 서비스에 귀속합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2. 이용자는 서비스를 이용함으로써 얻은 정보 중 서비스에게 지적재산권이 귀속된 정보를 서비스의 사전 승낙없이 
                복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제8조 (면책조항)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                1. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                2. 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                3. 서비스는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제9조 (준거법 및 관할법원)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                1. 서비스 이용과 관련하여 서비스와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2. 서비스 이용과 관련하여 서비스와 이용자 간에 발생한 분쟁에 관한 소송에는 대한민국 법을 적용합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">제10조 (연락처)</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  서비스 이용약관에 대한 문의사항이 있으시면 아래로 연락해 주시기 바랍니다.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>이메일:</strong> c8c8c81828@gmail.com<br/>
                  <strong>개발자:</strong> okuma
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                이 서비스 이용약관은 2024년 9월 29일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
