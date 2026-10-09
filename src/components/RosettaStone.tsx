import React, { useState } from 'react';
import { ROSETTA_CONCEPTS, RosettaConcept } from '../data/rosettaStone';
import { 
  Dna, Cpu, Layers, Sparkles, Search, Code2, 
  ShieldCheck, Database, ArrowRight, ExternalLink 
} from 'lucide-react';

export const RosettaStone: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedConcept, setSelectedConcept] = useState<RosettaConcept | null>(ROSETTA_CONCEPTS[0]);

  const filteredConcepts = ROSETTA_CONCEPTS.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.softwareConcept.toLowerCase().includes(q) ||
      c.biologyConcept.toLowerCase().includes(q) ||
      c.mechanismExplanation.toLowerCase().includes(q) ||
      c.oncologyContext.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <Layers className="w-4 h-4" />
            <span>CONCEPTUAL ROSETTA STONE · ZENODO RECORD 22955647</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Spring Batch Architecture $\longleftrightarrow$ CRISPR-Cas9 Biology
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            A comprehensive mapping between enterprise Java batch constructs and molecular gene-editing machinery.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search concepts, BRCA1..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main Dual Layout: Master List on Left, Deep-Dive Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Column: Concept Selector List */}
        <div className="lg:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
          {filteredConcepts.map((item) => {
            const isSelected = selectedConcept?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedConcept(item)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/70 shadow-md shadow-cyan-950/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-cyan-400 font-mono text-[11px]">{item.softwareConcept}</span>
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 border border-rose-900/60 px-1.5 py-0.5 rounded">
                    {item.biologyConcept}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.mechanismExplanation}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Inspector Card */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          {selectedConcept ? (
            <div className="space-y-4">
              {/* Concept Title Bar */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-cyan-400">
                    SPRING ARTIFACT: {selectedConcept.springArtifact}
                  </span>
                  <span className="text-xs font-mono text-rose-400">
                    MOLECULAR TARGET: {selectedConcept.molecularEntity}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedConcept.softwareConcept}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-rose-400">{selectedConcept.biologyConcept}</span>
                </h4>
              </div>

              {/* Mechanism Explanation */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Cross-Disciplinary Mechanism:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                  {selectedConcept.mechanismExplanation}
                </p>
              </div>

              {/* Oncology & Breast Cancer Context */}
              <div className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-1">
                  <Dna className="w-3.5 h-3.5 text-rose-400" />
                  <span>Oncology & Breast Cancer Relevance (BRCA1/2):</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {selectedConcept.oncologyContext}
                </p>
              </div>

              {/* Code Snippet Example */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                  <span>Java Spring Batch Implementation:</span>
                  <span className="text-cyan-400">Spring 5.x</span>
                </div>
                <pre className="text-[11px] font-mono text-cyan-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                  {selectedConcept.codeExample}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a concept from the list to view the cross-disciplinary mapping.
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Reference: Zenodo Record 22955647 by Wadï Mami</span>
            <a 
              href="https://zenodo.org/records/22955647" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Open DOI
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
