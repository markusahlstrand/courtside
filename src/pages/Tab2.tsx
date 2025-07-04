import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonChip,
  IonIcon,
} from "@ionic/react";
import { calendar, time, location, people } from "ionicons/icons";
import { useState, useEffect } from "react";
import { getDb, MatchDocType } from "../db";
import "./Tab2.css";

const Tab2: React.FC = () => {
  const [matches, setMatches] = useState<MatchDocType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      const db = await getDb();
      const matchDocs = await db.matches.find().exec();
      setMatches(
        matchDocs.map((doc) => ({
          id: doc.id,
          date: doc.date,
          time: doc.time,
          location: doc.location,
          team1: [...doc.team1],
          team2: [...doc.team2],
        }))
      );
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadMatches();
    event.detail.complete();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Games</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Games</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading games...
          </div>
        ) : matches.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>No games found. Create your first match!</p>
          </div>
        ) : (
          <IonList>
            {matches.map((match, index) => (
              <IonCard key={match.id || index}>
                <IonCardHeader>
                  <IonCardTitle>Tennis Match</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem lines="none">
                    <IonIcon icon={calendar} slot="start" />
                    <IonLabel>
                      <h3>Date</h3>
                      <p>{formatDate(match.date)}</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={time} slot="start" />
                    <IonLabel>
                      <h3>Time</h3>
                      <p>{match.time}</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={location} slot="start" />
                    <IonLabel>
                      <h3>Location</h3>
                      <p>{match.location}</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={people} slot="start" />
                    <IonLabel>
                      <h3>Teams</h3>
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <strong>Team 1:</strong>
                          <div>
                            {match.team1.map((player, playerIndex) => (
                              <IonChip key={playerIndex} color="primary">
                                {player}
                              </IonChip>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong>Team 2:</strong>
                          <div>
                            {match.team2.map((player, playerIndex) => (
                              <IonChip key={playerIndex} color="secondary">
                                {player}
                              </IonChip>
                            ))}
                          </div>
                        </div>
                      </div>
                    </IonLabel>
                  </IonItem>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
