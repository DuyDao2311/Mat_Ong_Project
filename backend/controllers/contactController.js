import Contact from '../models/Contact.js';
import { sendEmail } from '../utils/sendEmail.js';
import { contactConfirmationTemplate, adminNewContactTemplate, adminReplyContactTemplate } from '../utils/emailTemplates.js';

// @desc    Submit a new contact message
// @route   POST /api/contacts
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    const createdContact = await contact.save();

    // Fire-and-forget: Gửi email cho khách hàng xác nhận đã nhận
    if (email) {
      const { html, text } = contactConfirmationTemplate(createdContact);
      sendEmail({
        to: email,
        subject: '[Mật Ong Ngọc Trang] Cảm ơn bạn đã liên hệ',
        html,
        text
      }).catch(err => console.error("Lỗi gửi email cho khách:", err));
    }

    // Fire-and-forget: Gửi email cho Admin thông báo có tin nhắn mới
    if (process.env.EMAIL_USER) {
      const { html, text } = adminNewContactTemplate(createdContact);
      sendEmail({
        to: process.env.EMAIL_USER,
        subject: `[Thông báo Admin] Tin nhắn liên hệ mới từ ${name}`,
        html,
        text
      }).catch(err => console.error("Lỗi gửi email cho Admin:", err));
    }

    res.status(201).json({ message: 'Tin nhắn đã được gửi thành công.', data: createdContact });
  } catch (error) {
    console.error("Submit contact error:", error);
    res.status(500).json({ message: 'Lỗi server khi gửi tin nhắn.' });
  }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private/Admin
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("Fetch all contacts error:", error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách liên hệ' });
  }
};

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }
  } catch (error) {
    console.error("Fetch contact error:", error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết liên hệ' });
  }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.status = req.body.status || contact.status;
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }
  } catch (error) {
    console.error("Update contact status error:", error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái liên hệ' });
  }
};

// @desc    Reply to a contact message (send email + update status)
// @route   POST /api/contacts/:id/reply
// @access  Private/Admin
export const replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập nội dung phản hồi.' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }

    // Gửi email phản hồi cho khách hàng
    const { html, text } = adminReplyContactTemplate(contact, replyMessage);
    await sendEmail({
      to: contact.email,
      subject: '[Mật Ong Ngọc Trang] Phản hồi tin nhắn liên hệ',
      html,
      text
    });

    // Cập nhật trạng thái thành RESPONDED
    contact.status = 'RESPONDED';
    const updatedContact = await contact.save();

    res.json({ message: 'Phản hồi đã được gửi thành công.', data: updatedContact });
  } catch (error) {
    console.error("Reply contact error:", error);
    res.status(500).json({ message: 'Lỗi server khi gửi phản hồi.' });
  }
};

