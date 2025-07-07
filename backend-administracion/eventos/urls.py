# backend-administracion/eventos/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventoViewSet, WebinarViewSet, CarreraViewSet, UsuarioViewSet # Asegúrate de que estos ViewSets existan en eventos/views.py

router = DefaultRouter()
router.register(r'eventos', EventoViewSet)
router.register(r'webinars', WebinarViewSet)
router.register(r'carreras', CarreraViewSet)
router.register(r'usuarios', UsuarioViewSet) # Si tienes una API para usuarios

urlpatterns = [
    path('', include(router.urls)), # Esto incluye todas las rutas generadas por el router
    # Puedes añadir rutas adicionales específicas aquí si las necesitas más allá del router
]