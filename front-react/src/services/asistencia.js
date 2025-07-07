import axios from 'axios';

export const asistirAEvento = async ({ userId, eventoId, tipo }) => {
  return axios.post('/api/asistencias', { userId, eventoId, tipo });
};

export const contarAsistentes = async (eventoId, tipo) => {
  const res = await axios.get(`/api/asistencias/evento/${eventoId}/count?tipo=${tipo}`);
  return res.data;
};

export const yaAsistio = async (eventoId, userId, tipo) => {
  const res = await axios.get(`/api/asistencias/existe?eventoId=${eventoId}&userId=${userId}&tipo=${tipo}`);
  return res.data;
};
