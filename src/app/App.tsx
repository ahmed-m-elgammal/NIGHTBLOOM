import React, { useState } from 'react';
import { TitleScreen } from '../ui/screens/TitleScreen';
import { GameScreen } from '../ui/screens/GameScreen';
import { PersonaScreen } from '../ui/screens/PersonaScreen';
import { MiraValeHero } from '../game/content/heroes/mira';
import { ViewportShell } from './ViewportShell';

type AppScreen = 'title' | 'game' | 'dossier';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('title');

  let content: React.ReactNode;

  switch (screen) {
    case 'game':
      content = <GameScreen onReturnToTitle={() => setScreen('title')} />;
      break;

    case 'dossier':
      content = (
        <PersonaScreen
          hero={MiraValeHero}
          onBack={() => setScreen('title')}
        />
      );
      break;

    case 'title':
    default:
      content = (
        <TitleScreen
          onStartGame={() => setScreen('game')}
          onOpenDossier={() => setScreen('dossier')}
        />
      );
      break;
  }

  return <ViewportShell>{content}</ViewportShell>;
};
