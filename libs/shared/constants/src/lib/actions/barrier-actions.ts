export const BARRIER_ACTION = {
  GET: {},
  POST: {
    'base-url': 'Tạo mới barrier',
  },
  PATCH: {
    parameters: 'Cập nhật barrier',
    open: 'Mở khẩn cấp toàn bộ barrier',
    close: 'Đóng khẩn cấp toàn bộ barrier',
  },
  DELETE: {
    parameters: 'Xóa tài barrier',
    'base-url': 'Xóa nhiều barrier',
  },
};
