function cnblogs() {
  return {
    blogs: [],
    error: '',
    loading: true,
    
    async init() {
      await this.getBlogs();
    },
    
    async getBlogs() {
      try {
        this.loading = true;
        const res = await fetch('http://api.regnx.cc/cnblogs_posts/?u=786218&quantity=5');
        const rawData = await res.json();
        
        this.blogs = rawData.map(item => ({
          title: this.cleanTitle(item.title),
          link: item.link,
          published: item.published,
          summary: item.summary
        }));
        
        this.error = '';
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        this.error = 'Unable to load blogs data, please try again later.';
        this.blogs = [];
      } finally {
        this.loading = false;
      }
    },

    cleanTitle(title) {
      const suffix = ' - Regnx';
      if (title.endsWith(suffix)) {
        return title.slice(0, -suffix.length);
      }
      return title;
    }
  }
}