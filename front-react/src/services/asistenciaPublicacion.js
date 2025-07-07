import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const contarAsistentesPublicacion = async (publicacionId, tipo, token) => {
  // tipo puede ser "EVENTO", "WEBINAR" o lo que corresponda
  return axios.get(
    `${API_BASE_URL}/eventos/${publicacionId}/asistentes?tipo=${tipo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
