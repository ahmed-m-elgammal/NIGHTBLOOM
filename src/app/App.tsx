import React, { useState } from 'react';
import { TitleScreen } from '../ui/screens/TitleScreen';
import { GameScreen } from '../ui/screens/GameScreen';
import { PersonaScreen } from '../ui/screens/PersonaScreen';
import { MiraValeHero } from '../game/content/heroes/mira';

type AppScreen = 'title' | 'game' | 'dossier';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('title');

  switch (screen) {
    case 'game':
      return <GameScreen onReturnToTitle={() => setScreen('title')} />;

    case 'dossier':
      return (
        <PersonaScreen
          hero={MiraValeHero}
          onBack={() => setScreen('title')}
        />
      );

    case 'title':
    default:
      return (
        <TitleScreen
          onStartGame={() => setScreen('game')}
          onOpenDossier={() => setScreen('dossier')}
        />
      );
  }
};
