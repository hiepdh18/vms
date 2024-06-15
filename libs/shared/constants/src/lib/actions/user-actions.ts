export const USER_ACTION = {
  GET: {},
  POST: {
    'base-url': 'Tạo mới tài khoản người dùng',
    'change-password': 'Đổi mật khẩu',
  },
  PATCH: {
    parameters: 'Cập nhật tài khoản người dùng',
    lock: 'Khóa tài khoản',
    unlock: 'Mở khóa tài khoản',
  },
  DELETE: {
    parameters: 'Xóa tài khoản người dùng',
    'base-url': 'Xóa nhiều tài khoản người dùng',
  },
};
