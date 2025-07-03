import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonChip,
  IonLabel,
  IonButtons,
  IonMenuButton
} from '@ionic/react';
import { 
  search, 
  tennisball, 
  school, 
  trophy, 
  notifications,
  chevronForward
} from 'ionicons/icons';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Hi Markus 👋</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" className="notification-button">
              <IonIcon icon={notifications} />
              <div className="notification-badge"></div>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="home-content">
        {/* Premium Section */}
        <IonCard className="premium-card">
          <IonCardContent>
            <div className="premium-content">
              <div className="premium-icon">📱</div>
              <div className="premium-text">
                <h3>GET ONE STEP AHEAD</h3>
                <p>Get notified for available courts, grant your matches more visibility and discover your advanced statistics</p>
              </div>
              <IonIcon icon={chevronForward} className="premium-arrow" />
            </div>
          </IonCardContent>
        </IonCard>

        {/* Play your perfect match section */}
        <div className="section-title">
          <h2>Play your perfect match</h2>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard className="action-card">
                <div className="card-image book-court">
                  <div className="card-overlay">
                    <IonIcon icon={search} className="card-icon" />
                  </div>
                </div>
                <IonCardContent>
                  <h3>Book a court</h3>
                  <p>If you already know who you are playing with</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="action-card">
                <div className="card-image play-match">
                  <div className="card-overlay">
                    <IonIcon icon={tennisball} className="card-icon" />
                  </div>
                </div>
                <IonCardContent>
                  <h3>Play an open match</h3>
                  <p>If you are looking for players at your level</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonCard className="action-card">
                <div className="card-image classes">
                  <div className="card-overlay">
                    <IonIcon icon={school} className="card-icon" />
                  </div>
                </div>
                <IonCardContent>
                  <h3>Classes</h3>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="action-card">
                <div className="card-image competitions">
                  <div className="card-overlay">
                    <IonIcon icon={trophy} className="card-icon" />
                  </div>
                </div>
                <IonCardContent>
                  <h3>Competitions</h3>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Your clubs section */}
        <div className="section-title">
          <h2>Your clubs</h2>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
