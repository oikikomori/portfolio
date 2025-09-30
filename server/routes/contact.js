const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');
const { sendContactEmail } = require('../utils/email');

// 연락처 메시지 전송
router.post('/', [
  body('name').notEmpty().withMessage('이름은 필수입니다.'),
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('subject').notEmpty().withMessage('제목은 필수입니다.'),
  body('message').notEmpty().withMessage('메시지는 필수입니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const contact = new Contact({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    // MongoDB 연결 확인
    if (!mongoose.connection.readyState) {
      console.log('⚠️ MongoDB 연결이 없습니다. 메시지를 저장하지 않습니다.');
      // MongoDB가 없어도 응답은 정상적으로 처리
    } else {
      const savedContact = await contact.save();
      console.log('✅ 메시지가 데이터베이스에 저장되었습니다:', savedContact._id);
    }
    
    // 메일 전송 시도
    console.log('이메일 전송 시도 중...');
    let emailResult = { success: false, message: '이메일 전송 실패' };
    
    try {
      emailResult = await sendContactEmail(req.body);
      console.log('이메일 전송 결과:', emailResult);
    } catch (emailError) {
      console.error('이메일 전송 오류:', emailError);
      emailResult = { 
        success: false, 
        message: `이메일 전송 실패: ${emailError.message}` 
      };
    }
    
    // 성공 응답
    if (emailResult.success) {
      res.status(201).json({ 
        message: '메시지가 성공적으로 전송되었습니다.',
        emailSent: true
      });
    } else {
      res.status(201).json({ 
        message: '메시지가 저장되었습니다. (메일 전송 실패)',
        emailSent: false,
        emailError: emailResult.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 모든 연락처 메시지 조회 (관리자용)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 연락처 메시지 조회
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: '메시지를 찾을 수 없습니다.' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 메시지 상태 업데이트
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: '유효하지 않은 상태입니다.' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: '메시지를 찾을 수 없습니다.' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 메시지 삭제
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: '메시지를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '메시지가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
