const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

// 모든 포스트 조회
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 10 } = req.query;
    
    // 데이터베이스 연결 확인
    if (mongoose.connection.readyState !== 1) {
      // 데이터베이스가 연결되지 않은 경우 샘플 데이터 반환
      const samplePosts = [
        {
          _id: '1',
          title: 'Next.js 14 App Router 완벽 가이드',
          content: 'Next.js 14의 새로운 App Router에 대해 자세히 알아보고, 실제 프로젝트에 적용하는 방법을 설명합니다.',
          author: '승짱',
          category: 'tech',
          tags: ['Next.js', 'React', 'Web Development'],
          featured: true,
          views: 1250,
          likes: 89,
          comments: [],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: '포트폴리오 웹사이트 개발 후기',
          content: '이번에 개발한 포트폴리오 웹사이트의 개발 과정과 사용한 기술, 그리고 배운 점들을 공유합니다.',
          author: '승짱',
          category: 'project',
          tags: ['Portfolio', 'Next.js', 'Tailwind CSS'],
          featured: true,
          views: 890,
          likes: 67,
          comments: [],
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z'
        },
        {
          _id: '3',
          title: 'TypeScript와 함께하는 안전한 개발',
          content: 'TypeScript를 사용하여 개발할 때의 장점과 실제 프로젝트에서 활용하는 방법을 소개합니다.',
          author: '승짱',
          category: 'tech',
          tags: ['TypeScript', 'JavaScript', 'Development'],
          featured: false,
          views: 650,
          likes: 45,
          comments: [],
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z'
        }
      ];
      
      // 필터링 적용
      let filteredPosts = samplePosts;
      
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      if (featured === 'true') {
        filteredPosts = filteredPosts.filter(post => post.featured === true);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // 페이지네이션 적용
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      res.json({
        posts: paginatedPosts,
        totalPages: Math.ceil(filteredPosts.length / limit),
        currentPage: parseInt(page),
        total: filteredPosts.length
      });
      return;
    }
    
    let query = {};
    
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.$text = { $search: search };
    }
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Posts fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// 특정 포스트 조회 (조회수 증가)
router.get('/:id', async (req, res) => {
  try {
    // 데이터베이스 연결 확인
    if (mongoose.connection.readyState !== 1) {
      // 데이터베이스가 연결되지 않은 경우 샘플 데이터 반환
      const samplePosts = [
        {
          _id: '1',
          title: 'Next.js 14 App Router 완벽 가이드',
          content: 'Next.js 14의 새로운 App Router에 대해 자세히 알아보고, 실제 프로젝트에 적용하는 방법을 설명합니다.\n\n## 주요 특징\n\n1. **App Router의 장점**\n   - 더 직관적인 파일 기반 라우팅\n   - 서버 컴포넌트 지원\n   - 향상된 성능\n\n2. **실제 적용 방법**\n   - 기존 Pages Router에서 마이그레이션\n   - 새로운 폴더 구조 이해\n   - 서버 컴포넌트 활용\n\n## 결론\n\nApp Router는 Next.js의 미래이며, 새로운 프로젝트에서는 반드시 사용해야 할 기능입니다.',
          author: '승짱',
          category: 'tech',
          tags: ['Next.js', 'React', 'Web Development'],
          featured: true,
          views: 1250,
          likes: 89,
          comments: [
            {
              _id: '1',
              author: '개발자A',
              content: '정말 유용한 정보네요! 감사합니다.',
              createdAt: '2024-01-16T09:00:00Z'
            },
            {
              _id: '2',
              author: '개발자B',
              content: 'App Router로 마이그레이션하는데 도움이 많이 되었습니다.',
              createdAt: '2024-01-16T14:30:00Z'
            }
          ],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: '포트폴리오 웹사이트 개발 후기',
          content: '이번에 개발한 포트폴리오 웹사이트의 개발 과정과 사용한 기술, 그리고 배운 점들을 공유합니다.\n\n## 사용한 기술 스택\n\n- **Frontend**: Next.js 14, TypeScript, Tailwind CSS\n- **Backend**: Node.js, Express, MongoDB\n- **Deployment**: Vercel, MongoDB Atlas\n\n## 개발 과정\n\n1. **기획 단계**\n   - 포트폴리오의 목적과 대상 설정\n   - 필요한 기능들 정의\n   - 디자인 컨셉 구상\n\n2. **개발 단계**\n   - 컴포넌트 기반 개발\n   - 반응형 디자인 적용\n   - 성능 최적화\n\n## 배운 점\n\n- Next.js 14의 새로운 기능들을 활용한 개발 경험\n- TypeScript를 통한 타입 안정성 확보\n- 사용자 경험을 고려한 UI/UX 설계',
          author: '승짱',
          category: 'project',
          tags: ['Portfolio', 'Next.js', 'Tailwind CSS'],
          featured: true,
          views: 890,
          likes: 67,
          comments: [
            {
              _id: '3',
              author: '디자이너C',
              content: '디자인이 정말 깔끔하네요!',
              createdAt: '2024-01-11T11:00:00Z'
            }
          ],
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z'
        },
        {
          _id: '3',
          title: 'TypeScript와 함께하는 안전한 개발',
          content: 'TypeScript를 사용하여 개발할 때의 장점과 실제 프로젝트에서 활용하는 방법을 소개합니다.\n\n## TypeScript의 장점\n\n1. **타입 안정성**\n   - 컴파일 타임에 오류 발견\n   - 런타임 에러 방지\n   - 코드 품질 향상\n\n2. **개발자 경험 향상**\n   - 자동완성 기능\n   - 리팩토링 안전성\n   - 문서화 효과\n\n## 실제 활용 방법\n\n- 점진적 도입 전략\n- 엄격한 타입 설정\n- 유틸리티 타입 활용\n\nTypeScript는 대규모 프로젝트에서 특히 유용하며, 팀 개발에서도 큰 도움이 됩니다.',
          author: '승짱',
          category: 'tech',
          tags: ['TypeScript', 'JavaScript', 'Development'],
          featured: false,
          views: 650,
          likes: 45,
          comments: [],
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z'
        }
      ];
      
      const post = samplePosts.find(p => p._id === req.params.id);
      if (!post) {
        return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
      }
      
      // 조회수 증가 (샘플 데이터에서는 실제로 저장하지 않음)
      post.views += 1;
      
      res.json(post);
      return;
    }
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    
    // 조회수 증가
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Post fetch error:', error);
    res.status(500).json({ message: error.message });
  }
});

// 새 포스트 생성
router.post('/', [
  body('title').notEmpty().withMessage('제목은 필수입니다.'),
  body('content').notEmpty().withMessage('내용은 필수입니다.'),
  body('author').notEmpty().withMessage('작성자는 필수입니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 포스트 수정
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 포스트 삭제
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '포스트가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 댓글 추가
router.post('/:id/comments', [
  body('author').notEmpty().withMessage('작성자는 필수입니다.'),
  body('content').notEmpty().withMessage('댓글 내용은 필수입니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    
    post.comments.push({
      author: req.body.author,
      content: req.body.content
    });
    
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 좋아요 증가
router.post('/:id/like', async (req, res) => {
  try {
    // 데이터베이스 연결 확인
    if (mongoose.connection.readyState !== 1) {
      // 데이터베이스가 연결되지 않은 경우 샘플 응답 반환
      res.json({ 
        message: '좋아요가 추가되었습니다.',
        likes: Math.floor(Math.random() * 100) + 50 // 랜덤 좋아요 수
      });
      return;
    }
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '포스트를 찾을 수 없습니다.' });
    }
    
    post.likes += 1;
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
