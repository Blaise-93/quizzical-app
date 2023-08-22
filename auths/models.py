from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager
)

class UserAccountManager(BaseUserManager):
    """ model for all user accounts in our db """
    
    def create_superuser(self, email, password=None, **kwargs):
        if not email:
            
            raise ValueError("Users must have an email address")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        
        user.set_password(password)
        user.save()
        return user
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    """ Set intrinsic instances/attributes of our users credentials """
    email = models.EmailField(max_length=20, unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = UserAccountManager()
        
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [
        'first_name',
        'last_name'
    ]
    
    def get_full_name(self):
        return self.first_name
    
    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email