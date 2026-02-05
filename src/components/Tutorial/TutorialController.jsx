import React, { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../../driver-custom.css';

const TutorialController = () => {
    const driverObj = useRef(null);

    const startTutorial = () => {
        driverObj.current = driver({
            showProgress: true,
            allowClose: true,
            animate: true,
            overlayColor: 'rgba(0, 0, 0, 0.6)',
            // Steps configuration
            steps: [
                {
                    element: '#welcome-step',
                    popover: {
                        title: 'Velkommen til Hva er Klokka! 👋',
                        description: 'La oss ta en rask omvisning og lære hvordan du bruker appen.',
                        side: 'center',
                        align: 'center',
                    }
                },
                {
                    element: '#clock-face',
                    popover: {
                        title: 'Klokkevisning 🕒',
                        description: 'Klikk på selve klokken for å bytte mellom analog og digital visning.',
                        side: 'bottom',
                        align: 'center',
                    }
                },
                {
                    element: '#clock-pivot',
                    popover: {
                        title: 'Smarte hint 💡',
                        description: 'Klikk på prikken i midten for å se hjelpelinjer som gjør det lettere å lese klokka.',
                        side: 'top',
                        align: 'center',
                    }
                },
                {
                    element: '#controls-container',
                    popover: {
                        title: 'Ditt svar ✍️',
                        description: 'Bruk knappene her for å bygge setningen som beskriver klokkeslettet.',
                        side: 'top',
                        align: 'center',
                    }
                },
                {
                    element: '#header-actions',
                    popover: {
                        title: 'Innstillinger ⚙️',
                        description: 'Her kan du bytte mellom dag/natt-tema, slå på fullskjerm eller starte denne omvisningen på nytt.',
                        side: 'bottom',
                        align: 'start',
                    }
                },
                {
                    element: '#score-board',
                    popover: {
                        title: 'Poengtavle 🏆',
                        description: 'Hold øye med din "streak" og prøv å slå din egen rekord!',
                        side: 'bottom',
                        align: 'center',
                    }
                },
                {
                    element: '#contacts-section',
                    popover: {
                        title: 'Kontakt oss 📧',
                        description: 'Har du spørsmål eller tilbakemeldinger? Kontakt oss gjerne her.',
                        side: 'bottom',
                        align: 'end',
                    }
                },
            ],
            // Lifecycle hooks
            onDestroyStarted: () => {
                localStorage.setItem('tutorial_seen', 'true');
                if (driverObj.current) {
                    driverObj.current.destroy();
                }
            },
        });

        driverObj.current.drive();
    };

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('tutorial_seen');

        if (!hasSeenTutorial) {
            startTutorial();
        }

        const handleRestart = () => startTutorial();
        window.addEventListener('restart-tutorial', handleRestart);

        return () => {
            window.removeEventListener('restart-tutorial', handleRestart);
            if (driverObj.current) {
                driverObj.current.destroy();
            }
        };
    }, []);

    return null; // This component does not render anything itself
};

export default TutorialController;
