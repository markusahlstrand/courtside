import React, { useState, useRef } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonPopover,
} from "@ionic/react";
import { getDb } from "../db";

const mockPlayers = [
  "Markus",
  "Anna",
  "John",
  "Lisa",
  "Tom",
  "Sarah",
  "Alex",
  "Emma",
];

const CreateMatch: React.FC = () => {
  const [date, setDate] = useState<string>(""); // ISO date string (yyyy-mm-dd)
  const [time, setTime] = useState<string>(""); // ISO time string (HH:mm)
  const [location, setLocation] = useState<string>("");
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [created, setCreated] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<string>("");
  const [tempTime, setTempTime] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Insert match into RxDB
    const db = await getDb();
    await db.matches.insert({
      id: Date.now().toString(), // Simple ID generation
      date,
      time,
      location,
      team1,
      team2,
    });
    setCreated(true);
  };

  // Combine date and time into a single ISO string for display and sharing
  const getDateTimeString = () => {
    if (!date || !time) return "";
    // date: yyyy-mm-dd, time: HH:mm
    return `${date}T${time}`;
  };

  const handleShare = () => {
    const matchDetails = `Match at ${location} on ${getDateTimeString()}\nTeam 1: ${team1.join(
      ", "
    )}\nTeam 2: ${team2.join(", ")}`;
    if (navigator.share) {
      navigator.share({
        title: "Join my match!",
        text: matchDetails,
      });
    } else {
      // fallback: copy to clipboard
      navigator.clipboard.writeText(matchDetails);
      alert("Match details copied to clipboard!");
    }
  };

  const handleNew = () => {
    setCreated(false);
    setDate("");
    setLocation("");
    setTeam1([]);
    setTeam2([]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Create New Match</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {created ? (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <h2>🎾 Match Created!</h2>
            <p>
              <b>Date & Time:</b> {date}
              <br />
              <b>Location:</b> {location}
              <br />
              <b>Team 1:</b> {team1.join(", ")}
              <br />
              <b>Team 2:</b> {team2.join(", ")}
            </p>
            <IonButton
              expand="block"
              onClick={handleShare}
              style={{ marginBottom: 12 }}
            >
              Share Match
            </IonButton>
            <IonButton expand="block" fill="outline" onClick={handleNew}>
              Create Another Match
            </IonButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Date</IonLabel>
                <IonInput
                  value={date || ""}
                  placeholder="Enter date"
                  onFocus={() => {
                    setTempDate(date);
                    setShowDatePicker(true);
                  }}
                  readonly
                  required
                />
                <IonPopover
                  isOpen={showDatePicker}
                  onDidDismiss={() => setShowDatePicker(false)}
                >
                  <IonDatetime
                    presentation="date"
                    value={date}
                    onIonChange={(e) => {
                      const v = e.detail.value ? String(e.detail.value) : "";
                      // Always extract YYYY-MM-DD
                      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
                        setDate(v);
                      } else if (v) {
                        const parsed = new Date(v);
                        if (!isNaN(parsed.getTime())) {
                          setDate(parsed.toISOString().slice(0, 10));
                        }
                      }
                      setShowDatePicker(false);
                    }}
                  />
                </IonPopover>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Time</IonLabel>
                <IonInput
                  value={time || ""}
                  placeholder="Enter time"
                  onFocus={() => {
                    setTempTime(time);
                    setShowTimePicker(true);
                  }}
                  readonly
                  required
                />
                <IonPopover
                  isOpen={showTimePicker}
                  onDidDismiss={() => setShowTimePicker(false)}
                >
                  <IonDatetime
                    presentation="time"
                    value={time}
                    minuteValues="0,30"
                    hourCycle="h23"
                    onIonChange={(e) => {
                      const v = e.detail.value ? String(e.detail.value) : "";
                      // If v is already HH:mm, use as is
                      if (/^\d{2}:\d{2}$/.test(v)) {
                        setTime(v);
                      } else if (v) {
                        const match = v.match(/T(\d{2}:\d{2})/);
                        if (match) {
                          setTime(match[1]);
                        } else {
                          const parsed = new Date(v);
                          if (!isNaN(parsed.getTime())) {
                            const hh = parsed
                              .getHours()
                              .toString()
                              .padStart(2, "0");
                            const mm = parsed
                              .getMinutes()
                              .toString()
                              .padStart(2, "0");
                            setTime(`${hh}:${mm}`);
                          }
                        }
                      }
                      setShowTimePicker(false);
                    }}
                  />
                </IonPopover>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Location</IonLabel>
                <IonInput
                  value={location}
                  placeholder="Enter location"
                  onIonInput={(e) => setLocation(e.detail.value as string)}
                  required
                />
              </IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Team 1</IonLabel>
                      <IonSelect
                        multiple
                        value={team1}
                        placeholder="Select 2 players"
                        onIonChange={(e) => setTeam1(e.detail.value)}
                        required
                      >
                        {mockPlayers.map((player) => (
                          <IonSelectOption
                            key={player}
                            value={player}
                            disabled={team2.includes(player)}
                          >
                            {player}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Team 2</IonLabel>
                      <IonSelect
                        multiple
                        value={team2}
                        placeholder="Select 2 players"
                        onIonChange={(e) => setTeam2(e.detail.value)}
                        required
                      >
                        {mockPlayers.map((player) => (
                          <IonSelectOption
                            key={player}
                            value={player}
                            disabled={team1.includes(player)}
                          >
                            {player}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonList>
            <IonButton
              expand="block"
              type="submit"
              disabled={
                team1.length !== 2 || team2.length !== 2 || !date || !location
              }
            >
              Create Match
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CreateMatch;
