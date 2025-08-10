import api from './index';

export default {
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return api({
      method: 'post',
      url: 'api/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
