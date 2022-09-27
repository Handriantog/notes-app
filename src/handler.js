const { response } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const successResponse = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    successResponse.code(201);
    return successResponse;
  }

  const errorResponse = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  errorResponse.code(500);
  return errorResponse;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const errorResponse = h.response({
    status: 'fail',
    mesage: 'Catatan tidak ditemukan',
  });
  errorResponse.code(404);
  return errorResponse;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const successResponse = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    successResponse.code(200);
    return successResponse;
  }

  const errorResponse = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  errorResponse.code(404);
  return errorResponse;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    const successResponse = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    successResponse.code(200);
    return successResponse;
  }

  const errorResponse = h.response({
    status: 'fail',
    mesage: 'Tidak ditemukan note dengan id tersebut',
  });
  errorResponse.code(404);
  return errorResponse;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
