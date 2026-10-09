export interface RosettaConcept {
  id: string;
  softwareConcept: string;
  springArtifact: string;
  biologyConcept: string;
  molecularEntity: string;
  mechanismExplanation: string;
  oncologyContext: string; // BRCA1/BRCA2 focus
  codeExample: string;
  biologyIconType: 'dna' | 'enzyme' | 'target' | 'batch' | 'repair' | 'metadata';
}

export const ROSETTA_CONCEPTS: RosettaConcept[] = [
  {
    id: "job",
    softwareConcept: "Job / JobExecution",
    springArtifact: "org.springframework.batch.core.Job",
    biologyConcept: "Gene Editing Campaign / Protocol",
    molecularEntity: "Full in-vitro / in-vivo experimental treatment",
    mechanismExplanation:
      "A complete batch program from initialization to completion. In CRISPR, this is the entire treatment protocol targeting a specific gene, configuring cell delivery vectors, incubation time, and verification assays.",
    oncologyContext:
      "Targeting the BRCA1 mutation locus in triple-negative breast cancer cell lines to restore wild-type tumor suppressor reading frames.",
    codeExample: `@Bean\npublic Job brca1GeneCorrectionJob(JobRepository repo, Step step1, Step step2) {\n    return new JobBuilder("brca1Correction", repo)\n        .start(step1)\n        .next(step2)\n        .build();\n}`,
    biologyIconType: "batch",
  },
  {
    id: "step",
    softwareConcept: "Step / StepExecution",
    springArtifact: "org.springframework.batch.core.Step",
    biologyConcept: "Protocol Phase / Assay Milestone",
    molecularEntity: "Isolated experimental stage (e.g. Transfection, Incubation, Cleavage)",
    mechanismExplanation:
      "An independent, sequential unit of work within a Job. Encapsulates specific business rules and transactional boundaries. In biology, isolating target sequence validation from actual physical delivery prevents premature irreversible modifications.",
    oncologyContext:
      "Stage 1: Verify gRNA homology against BRCA1 185delAG mutation. Stage 2: Deliver RNP complex. Stage 3: Assay cleavage frequency.",
    codeExample: `Step cleavageStep = new StepBuilder("cas9CleavageStep", repo)\n    .<DnaTarget, CleavedLocus>chunk(20, txManager)\n    .reader(fastaReader)\n    .processor(pamMatcher)\n    .writer(cas9Cleaver)\n    .build();`,
    biologyIconType: "target",
  },
  {
    id: "reader",
    softwareConcept: "ItemReader<T>",
    springArtifact: "org.springframework.batch.item.ItemReader",
    biologyConcept: "Genomic Sequence Ingestion",
    molecularEntity: "DNA Polymerase / Scanning Cas9 surveillance complex",
    mechanismExplanation:
      "Provides sequential reads of individual records from data sources (files, databases, APIs) without loading the entire dataset into memory. In CRISPR, Cas9 interrogates genomic chromatin, scanning DNA base-by-base in search of potential target sites.",
    oncologyContext:
      "Streaming exon sequences of human chromosome 17 (BRCA1) to locate the exact 20-bp protospacer sequence adjacent to the mutation site.",
    codeExample: `public class Brca1ExonItemReader implements ItemReader<DnaWindow> {\n    private final Iterator<DnaWindow> windowStream;\n    @Override\n    public DnaWindow read() {\n        return windowStream.hasNext() ? windowStream.next() : null; // null signals EOF\n    }\n}`,
    biologyIconType: "dna",
  },
  {
    id: "processor",
    softwareConcept: "ItemProcessor<I, O>",
    springArtifact: "org.springframework.batch.item.ItemProcessor",
    biologyConcept: "PAM Search & gRNA Hybridization",
    molecularEntity: "Cas9 PAM-interacting domain (PID) & 20nt crRNA seed sequence",
    mechanismExplanation:
      "Transforms an input item or filters it out by returning null. SpCas9 inspects the DNA for a 5'-NGG-3' PAM motif. If no PAM exists, Cas9 unbinds (returning null / filtering). If PAM matches, Cas9 unzips the DNA and tests guide RNA complementarity.",
    oncologyContext:
      "Scoring on-target cleavage efficiency against BRCA1 while calculating off-target penalties across pseudogenes to prevent inadvertent oncogene disruption.",
    codeExample: `public class PamVerificationProcessor implements ItemProcessor<DnaWindow, CleavageProposal> {\n    @Override\n    public CleavageProposal process(DnaWindow window) {\n        if (!window.endsWith("GG")) return null; // Filter item: no PAM found\n        double offTargetScore = cfdCalculator.score(window);\n        return offTargetScore < 0.1 ? new CleavageProposal(window) : null;\n    }\n}`,
    biologyIconType: "enzyme",
  },
  {
    id: "writer",
    softwareConcept: "ItemWriter<O>",
    springArtifact: "org.springframework.batch.item.ItemWriter",
    biologyConcept: "Endonuclease Cleavage (Double-Strand Break)",
    molecularEntity: "Cas9 HNH and RuvC catalytic nuclease domains",
    mechanismExplanation:
      "Receives a chunk of processed items and performs batch updates or writes. In CRISPR, once guide RNA hybridizes to the target, the HNH domain cleaves the target strand and RuvC cleaves the non-target strand 3bp upstream of PAM.",
    oncologyContext:
      "Physical double-strand break induction at the mutant BRCA1 allele, triggering cellular DNA repair to knockout or repair the defective sequence.",
    codeExample: `public class Cas9EndonucleaseWriter implements ItemWriter<CleavageProposal> {\n    @Override\n    public void write(Chunk<? extends CleavageProposal> chunk) {\n        for (CleavageProposal p : chunk) {\n            rnpComplex.cleaveTarget(p.getChromosome(), p.getPosition());\n        }\n    }\n}`,
    biologyIconType: "enzyme",
  },
  {
    id: "chunk",
    softwareConcept: "Chunk-Oriented Processing",
    springArtifact: "org.springframework.batch.core.step.item.Chunk<I>",
    biologyConcept: "Transfection Batch / Multi-Well Screening",
    molecularEntity: "Microplate well transfection (96-well / 384-well arrays)",
    mechanismExplanation:
      "Reads and processes items iteratively until a commit interval is reached, then writes the entire chunk inside a transaction. In the wet lab, CRISPR targets are batched into multi-well plates with shared delivery reagent pools.",
    oncologyContext:
      "High-throughput screening of 50 candidate guide RNAs across patient-derived organoid cultures in parallel chunks.",
    codeExample: `<chunk reader="targetReader"\n       processor="pamProcessor"\n       writer="cleavageWriter"\n       commit-interval="24" />`,
    biologyIconType: "batch",
  },
  {
    id: "skip",
    softwareConcept: "SkipPolicy",
    springArtifact: "org.springframework.batch.core.step.skip.SkipPolicy",
    biologyConcept: "Non-Homologous End Joining (NHEJ) / Indel Tolerance",
    molecularEntity: "Ku70/Ku80 heterodimer & DNA-PKcs non-homologous repair",
    mechanismExplanation:
      "Specifies exceptions that should not fail the job, allowing processing to continue while recording the anomaly. In biology, NHEJ frequently introduces 1-2bp insertions or deletions (indels) that cause frameshifts without aborting cellular viability.",
    oncologyContext:
      "Inducing targeted frameshift indels to knock down mutated oncogenic isoforms in resistant breast carcinoma models.",
    codeExample: `stepBuilder.faultTolerant()\n    .skip(OffTargetBindingException.class)\n    .skipLimit(10)\n    .listener(new GenomicAnomalySkipListener())`,
    biologyIconType: "repair",
  },
  {
    id: "retry",
    softwareConcept: "RetryPolicy",
    springArtifact: "org.springframework.batch.core.step.retry.RetryPolicy",
    biologyConcept: "Homology-Directed Repair (HDR) & Template Re-attempt",
    molecularEntity: "Rad51 nucleoprotein filament & exogenous donor repair template",
    mechanismExplanation:
      "Re-executes an operation upon transient failures. In CRISPR, if Cas9 cleaves DNA but cell cycle conditions favor repair, the cell uses a donor DNA template via HDR to reconstruct the wild-type sequence with precision.",
    oncologyContext:
      "Providing single-stranded oligodeoxynucleotide (ssODN) donor templates to restore wild-type BRCA1 tumor suppressor reading frames.",
    codeExample: `stepBuilder.faultTolerant()\n    .retry(TransientChromatinInaccessibleException.class)\n    .maxRetryAttempts(3)\n    .backOffPolicy(new ExponentialBackOffPolicy())`,
    biologyIconType: "repair",
  },
  {
    id: "repository",
    softwareConcept: "JobRepository & Metadata",
    springArtifact: "org.springframework.batch.core.repository.JobRepository",
    biologyConcept: "Epigenetic State & High-Throughput NGS Logging",
    molecularEntity: "Next-Generation Sequencing (NGS) audit trails & epigenetic chromatin marks",
    mechanismExplanation:
      "Persists runtime metadata including JobExecution statuses, Step timings, and commit counts. In genomics, deep amplicon sequencing serves as the permanent audit log of editing efficiency, on-target cuts, and off-target frequencies.",
    oncologyContext:
      "NGS read counts verifying 89.4% on-target editing efficiency at the BRCA1 target locus with <0.02% off-target indels in top 10 predicted loci.",
    codeExample: `// Spring Batch persists execution state in BATCH_JOB_EXECUTION,\n// mirroring NGS sequencing run metrics and audit records.`,
    biologyIconType: "metadata",
  },
];
