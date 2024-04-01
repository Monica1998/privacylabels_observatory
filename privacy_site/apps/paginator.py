from django.core.paginator import Paginator
from rest_framework.pagination import CursorPagination

class DumbPaginator(Paginator):
   """
   Paginator that does not count the rows in the table.
   """
   def count(self):
       return 9999999999
   
class Paginator(CursorPagination):
    page_size = 50
    ordering = 'id'
