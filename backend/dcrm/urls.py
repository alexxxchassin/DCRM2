from django.conf.urls import patterns, include, url

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'dcrm.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^generate/', 'dg.views.generate'),
    url(r'^login/', 'dg.views.login'),
    url(r'^main/', 'dg.views.main'),
    url(r'^data/', 'dg.views.data'),
)
