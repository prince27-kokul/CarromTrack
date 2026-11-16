# CarromTrack

CarromTrack is an offline carrom season tracker built with Expo, React Native and TypeScript. Browse the season overview, teams, players, matches and insights, and open team, player or match details.

## Screens

- **Overview:** season performance, upcoming fixtures and recent results.
- **Teams and Players:** search and browse squads and their rosters.
- **Matches:** filter fixtures, open match details and add a fixture with an optional score.
- **Insights:** season standings and match statistics.

Season data, including newly added fixtures, is saved locally with AsyncStorage. The project does not use a remote API.

## Run the app

Install Node.js, then run from the project directory:

```sh
npm install
npm start
```

For the desktop browser preview, run:

```sh
npm run web
```

The desktop layout appears in wide windows; narrow windows retain the mobile layout. Expo Go and the platform commands `npm run android` and `npm run ios` are also available.

Type-check the project with:

```sh
npm run typecheck
```
