/**
 * Web Speech API wrapper with intelligent timer fallback
 * Handles voiceover narration for CRISPR-Batch video playback.
 */

export interface SpeechVoiceOption {
  id: string;
  name: string;
  lang: string;
  default: boolean;
}

export class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.0;
  private isMuted: boolean = false;
  private onEndCallback: (() => void) | null = null;
  private onBoundaryCallback: ((charIndex: number) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const rawVoices = this.synth.getVoices();
    this.voices = rawVoices.filter(v => v.lang.startsWith('en'));
    if (this.voices.length > 0 && !this.selectedVoice) {
      // Prefer natural sounding English voices if available
      const preferred = this.voices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Samantha') || 
        v.name.includes('Daniel')
      );
      this.selectedVoice = preferred || this.voices[0];
    }
  }

  public getAvailableVoices(): SpeechVoiceOption[] {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices.map(v => ({
      id: v.voiceURI,
      name: v.name,
      lang: v.lang,
      default: v.default || v === this.selectedVoice,
    }));
  }

  public setVoice(voiceUri: string) {
    const found = this.voices.find(v => v.voiceURI === voiceUri);
    if (found) {
      this.selectedVoice = found;
    }
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(2.5, newRate));
    if (this.currentUtterance && this.synth && this.synth.speaking) {
      // Re-triggering rate in real time if speaking
      this.currentUtterance.rate = this.rate;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public speak(
    text: string, 
    onEnd?: () => void, 
    onBoundary?: (charIndex: number) => void
  ) {
    this.stop();

    this.onEndCallback = onEnd || null;
    this.onBoundaryCallback = onBoundary || null;

    if (this.isMuted || !this.synth) {
      // If muted or speech not available, fallback immediately or after a simulated timer
      return;
    }

    try {
      // Clean text of technical brackets for smoother speech
      const cleanedText = text
        .replace(/5'-/g, "5 prime ")
        .replace(/-3'/g, " 3 prime")
        .replace(/\bPAM\b/g, "pam")
        .replace(/BRCA1/g, "B R C A 1")
        .replace(/BRCA2/g, "B R C A 2")
        .replace(/Cas9/g, "Cass 9")
        .replace(/gRNA/g, "guide R N A")
        .replace(/crRNA/g, "CR R N A")
        .replace(/DSB/g, "double strand break")
        .replace(/NHEJ/g, "non-homologous end joining")
        .replace(/HDR/g, "homology-directed repair");

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.rate;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.onEndCallback) this.onEndCallback();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (this.onEndCallback) this.onEndCallback();
      };

      utterance.onboundary = (e) => {
        if (this.onBoundaryCallback) {
          this.onBoundaryCallback(e.charIndex);
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch {
      // In case speech is restricted by browser policy
      if (this.onEndCallback) this.onEndCallback();
    }
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }
}

export const speechEngine = new SpeechEngine();
