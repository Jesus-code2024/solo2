from django.shortcuts import render

# Create your views here.
# administracion/views.py

from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse # Importa HttpResponse

# ... tus otras vistas (LoginView, LogoutView, etc.) ...

class HomeView(View):
    def get(self, request):
        # Puedes renderizar un template HTML aquí si lo tienes:
        # return render(request, 'administracion/home.html')

        # O simplemente devolver una respuesta HTTP simple:
        return HttpResponse("<h1>¡Bienvenido a la página de inicio de tu Administrador!</h1><p>Desde aquí puedes navegar a otras secciones.</p>")

# Continúan tus otras vistas como LoginView, LogoutView, etc.
# Ejemplo de LoginView para referencia, si ya la tienes:
# class LoginView(View):
#     def get(self, request):
#         return render(request, 'administracion/login.html')
#     def post(self, request):
#         # ... lógica de inicio de sesión ...
#         pass