# administracion/views.py

from django.shortcuts import render, redirect
from django.views import View
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
import requests
from django.http import HttpResponseRedirect, HttpResponse # Asegúrate de importar HttpResponse

# VISTA DE INICIO: ¡AGREGA ESTA CLASE!
class HomeView(View):
    def get(self, request):
        # Puedes renderizar una plantilla HTML aquí si la tienes:
        # return render(request, 'administracion/home.html')

        # O simplemente devolver una respuesta HTTP simple:
        return HttpResponse("<h1>¡Bienvenido a la página de inicio de tu Administrador!</h1><p>Desde aquí puedes navegar a otras secciones.</p>")


class JWTRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.session.get('jwt_token'):
            return redirect('login')
        return super().dispatch(request, *args, **kwargs)

class LoginView(View):
    def get(self, request):
        return render(request, 'administracion/login.html')

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Cambia la URL si tu backend de usuarios usa otra ruta para login
        url = 'http://localhost:8080/api/auth/login'
        data = {'username': username, 'password': password}
        try:
            resp = requests.post(url, json=data)
            if resp.status_code == 200:
                token = resp.json().get('token')
                if token:
                    request.session['jwt_token'] = token
                    return redirect('usuarios_list')
                else:
                    messages.error(request, 'No se recibió token de autenticación.')
            else:
                messages.error(request, 'Credenciales inválidas o error de autenticación.')
        except Exception as e:
            messages.error(request, f'Error de conexión: {e}')
        return render(request, 'administracion/login.html')

class LogoutView(View):
    def get(self, request):
        request.session.flush()
        return redirect('login')

    def post(self, request):
        request.session.flush()
        return redirect('login')

# Ejemplo de vista para listar usuarios consumiendo el backend de usuarios
class UsuariosListView(JWTRequiredMixin, View):
    def get(self, request):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}'} if token else {}
        response = requests.get('http://localhost:8080/api/users', headers=headers)
        usuarios = response.json() if response.status_code == 200 else []
        return render(request, 'administracion/usuarios_list.html', {'usuarios': usuarios})

class UsuarioCreateView(JWTRequiredMixin, View):
    def get(self, request):
        return render(request, 'administracion/usuario_form.html')

    def post(self, request):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'} if token else {}
        data = {
            'username': request.POST.get('username'),
            'email': request.POST.get('email'),
            'password': request.POST.get('password'),
            'rol': request.POST.get('rol', 'USER')
        }
        resp = requests.post('http://localhost:8080/api/usuarios', json=data, headers=headers)
        if resp.status_code == 201:
            messages.success(request, 'Usuario creado exitosamente.')
            return redirect('usuarios_list')
        else:
            messages.error(request, 'Error al crear usuario: ' + resp.text)
            return render(request, 'administracion/usuario_form.html', {'data': data})

class UsuarioDeleteView(JWTRequiredMixin, View):
    def post(self, request, user_id):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}'} if token else {}
        resp = requests.delete(f'http://localhost:8080/api/usuarios/{user_id}', headers=headers)
        if resp.status_code == 204:
            messages.success(request, 'Usuario eliminado exitosamente.')
        else:
            messages.error(request, 'Error al eliminar usuario: ' + resp.text)
        return redirect('usuarios_list')

class UsuarioRegistroView(View):
    def get(self, request):
        return render(request, 'administracion/usuario_registro.html')

    def post(self, request):
        data = {
            'username': request.POST.get('username'),
            'email': request.POST.get('email'),
            'password': request.POST.get('password'),
            'firstName': request.POST.get('firstName'),
            'lastName': request.POST.get('lastName'),
        }
        try:
            resp = requests.post('http://localhost:8080/api/auth/signup', json=data)
            if resp.status_code == 200:
                messages.success(request, 'Usuario registrado exitosamente. Ahora puede iniciar sesión.')
                return redirect('login')
            else:
                messages.error(request, 'Error al registrar usuario: ' + resp.text)
        except Exception as e:
            messages.error(request, f'Error de conexión: {e}')
        return render(request, 'administracion/usuario_registro.html', {'data': data})

class GoogleLoginView(View):
    def get(self, request):
        # Redirige al endpoint de OAuth2 del backend de usuarios
        return HttpResponseRedirect('http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:8000/oauth2/callback/google')

class GoogleCallbackView(View):
    def get(self, request):
        # Recibe el token del backend de usuarios como parámetro en la URL
        token = request.GET.get('token')
        if token:
            request.session['jwt_token'] = token
            return redirect('usuarios_list')
        messages.error(request, 'No se pudo autenticar con Google.')
        return redirect('login')

class EventosListView(JWTRequiredMixin, View):
    def get(self, request):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}'} if token else {}
        response = requests.get('http://localhost:8080/api/eventos', headers=headers)
        eventos = response.json() if response.status_code == 200 else []
        return render(request, 'administracion/eventos_list.html', {'eventos': eventos})

class PublicacionesListView(JWTRequiredMixin, View):
    def get(self, request):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}'} if token else {}
        anuncios = requests.get('http://localhost:8080/api/anuncios', headers=headers)
        eventos = requests.get('http://localhost:8080/api/eventos', headers=headers)
        webinars = requests.get('http://localhost:8080/api/webinars', headers=headers)
        publicaciones = []
        if anuncios.status_code == 200:
            publicaciones += [{**a, 'tipo': 'anuncio'} for a in anuncios.json()]
        if eventos.status_code == 200:
            publicaciones += [{**e, 'tipo': 'evento'} for e in eventos.json()]
        if webinars.status_code == 200:
            publicaciones += [{**w, 'tipo': 'webinar'} for w in webinars.json()]
        return render(request, 'administracion/publicaciones_list.html', {'publicaciones': publicaciones})

class PublicacionDeleteView(JWTRequiredMixin, View):
    def post(self, request, tipo, pub_id):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}'} if token else {}
        if tipo == 'anuncio':
            url = f'http://localhost:8080/api/anuncios/{pub_id}'
        elif tipo == 'evento':
            url = f'http://localhost:8080/api/eventos/{pub_id}'
        elif tipo == 'webinar':
            url = f'http://localhost:8080/api/webinars/{pub_id}'
        else:
            messages.error(request, 'Tipo de publicación no válido.')
            return redirect('publicaciones_list')
        resp = requests.delete(url, headers=headers)
        if resp.status_code == 204:
            messages.success(request, 'Publicación eliminada exitosamente.')
        else:
            messages.error(request, 'Error al eliminar publicación: ' + resp.text)
        return redirect('publicaciones_list')

class PublicacionEditView(JWTRequiredMixin, View):
    def get(self, request, tipo, pub_id):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}'} if token else {}
        if tipo == 'anuncio':
            url = f'http://localhost:8080/api/anuncios/{pub_id}'
        elif tipo == 'evento':
            url = f'http://localhost:8080/api/eventos/{pub_id}'
        elif tipo == 'webinar':
            url = f'http://localhost:8080/api/webinars/{pub_id}'
        else:
            messages.error(request, 'Tipo de publicación no válido.')
            return redirect('publicaciones_list')
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            publicacion = resp.json()
            publicacion['tipo'] = tipo
            return render(request, 'administracion/publicacion_form.html', {'publicacion': publicacion})
        else:
            messages.error(request, 'No se pudo obtener la publicación.')
            return redirect('publicaciones_list')

    def post(self, request, tipo, pub_id):
        token = request.session.get('jwt_token')
        headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'} if token else {}
        data = {
            'titulo': request.POST.get('titulo'),
            'contenido': request.POST.get('contenido') or request.POST.get('descripcion'),
        }
        # Campos específicos según tipo
        if tipo == 'anuncio':
            data['tipo'] = request.POST.get('tipo_anuncio')
        elif tipo == 'evento':
            data['descripcion'] = request.POST.get('descripcion')
            data['fechaInicio'] = request.POST.get('fechaInicio')
            data['fechaFin'] = request.POST.get('fechaFin')
            data['ubicacion'] = request.POST.get('ubicacion')
            data['capacidad'] = request.POST.get('capacidad')
        elif tipo == 'webinar':
            data['descripcion'] = request.POST.get('descripcion')
            data['fecha'] = request.POST.get('fecha')
            data['expositor'] = request.POST.get('expositor')
            data['enlace'] = request.POST.get('enlace')
        if tipo == 'anuncio':
            url = f'http://localhost:8080/api/anuncios/{pub_id}'
        elif tipo == 'evento':
            url = f'http://localhost:8080/api/eventos/{pub_id}'
        elif tipo == 'webinar':
            url = f'http://localhost:8080/api/webinars/{pub_id}'
        else:
            messages.error(request, 'Tipo de publicación no válido.')
            return redirect('publicaciones_list')
        resp = requests.put(url, json=data, headers=headers)
        if resp.status_code in (200, 204):
            messages.success(request, 'Publicación actualizada exitosamente.')
            return redirect('publicaciones_list')
        else:
            messages.error(request, 'Error al actualizar publicación: ' + resp.text)
            return render(request, 'administracion/publicacion_form.html', {'publicacion': data, 'tipo': tipo})