function steam() {
  return {
    games: [],
    error: '',
    loading: true,

    async init() {
      await this.getGames();
    },

    async getGames() {
      try {
        this.loading = true;
        const res = await fetch('https://api.regnx.cc/steam/GetRecentlyPlayedGames/?key=75D33BD0E45ABF62FBCD02A9F781A464&steamid=76561199800474426');
        const rawData = await res.json();
        // Access the nested games array (common Steam API structure)
        const gamesArray = rawData?.response?.games || [];

        // most 3 games
        const limitedGames = gamesArray.slice(0, 3);
        this.games = limitedGames.map(item => ({
          appid: item.appid,
          name: item.name,
          iconUrl: `https://media.steampowered.com/steamcommunity/public/images/apps/${item.appid}/${item.img_icon_url}.jpg`,
          playtime2Weeks: this.formatPlaytime(item.playtime_2weeks),
          playtimeForever: this.formatPlaytime(item.playtime_forever),
          playtimePercentage: this.calculatePlaytimePercentage(item.playtime_2weeks, item.playtime_forever)
        }));

      } catch (error) {
        console.error('Failed to fetch games:', error);
        this.error = 'Unable to load games data, please try again later.';
        this.blogs = [];
      } finally {
        this.loading = false;
      }
    },

    // format playtime_2weeks
    formatPlaytime(minutes) {
      if (minutes <= 0) return '0h';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    },

    // format playtime_2weeks to percentage
    calculatePlaytimePercentage(recent, total) {
      if (total === 0) return 0;
      return Math.min(Math.round((recent / total) * 100), 100);
    }

  }
}