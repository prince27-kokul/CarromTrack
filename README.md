# CarromTrack

CarromTrack is an offline carrom game tracker built with Expo, React Native and TypeScript. This first UI release focuses on the Home and New Game screens, with a responsive desktop dashboard and a compact mobile layout.

## Screens

- **Home:** performance summary, carrom board illustration and a shortcut to game setup.
- **New Game:** choose players and game type, and set a target score.
- **Appearance:** switch between dark and light themes; the selection is saved on the device.

The Live Game, Statistics, History and Profile screens are not part of this first UI release.

Match statistics are saved locally with AsyncStorage. The project does not use a remote API.

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
