export interface ChapterKeyframe {
  timeOffset: number; // seconds from chapter start
  title: string;
  subtitle: string;
  narrationText: string;
  visualMode: 'overview' | 'reader' | 'processor' | 'writer' | 'chunk' | 'fault_tolerance' | 'oncology' | 'cover';
  highlightNode?: string;
  codeSnippet?: string;
  dnaSequence?: string;
  pamIndex?: number;
}

export interface VideoChapter {
  id: number;
  chapterNumber: string;
  title: string;
  shortDescription: string;
  duration: number; // in seconds
  timestamp: string; // MM:SS format
  category: string;
  bgImage?: string;
  keyframes: ChapterKeyframe[];
  fullTranscript: string;
  directorNotes: string;
  keyTakeaway: string;
  zenodoCitation: string;
}

export const CHAPTERS_DATA: VideoChapter[] = [
  {
    id: 1,
    chapterNumber: "01",
    title: "Two Worlds Converge: Spring Batch & CRISPR-Cas9",
    shortDescription: "Introducing Wadï Mami's Zenodo model (22955647) bridging enterprise batch architecture with molecular genome editing.",
    duration: 75,
    timestamp: "00:00",
    category: "Foundations & Motivation",
    bgImage: "/src/assets/images/crispr_batch_cover_1791578142910.jpg",
    directorNotes: "Cinematic opening with dual graphics. Introduce the Zenodo record 22955647 and Breast Cancer Awareness Month context.",
    keyTakeaway: "Both systems process massive sequence datasets under strict deterministic constraints and atomicity.",
    zenodoCitation: "Mami, W. (2024). Spring batch model for CRISPR-Cas9. Zenodo. https://zenodo.org/records/22955647",
    fullTranscript:
      "Welcome to an unprecedented crossover between distributed enterprise software architecture and cutting-edge molecular biology. In Zenodo record 22955647, researcher Wadï Mami published a breakthrough conceptual model: CRISPR-Batch, viewing Spring Batch as an execution engine for CRISPR-Cas9 gene editing. Why would anyone map Java chunk processing to RNA-guided endonucleases? Because at its core, cellular DNA editing is high-throughput, sequential, stateful batch processing. In the context of Breast Cancer Awareness Month, where targeting oncogenic mutations in BRCA1 and BRCA2 requires flawless molecular precision, this paradigm offers engineers and bioinformaticians a common language.",
    keyframes: [
      {
        timeOffset: 0,
        title: "The Molecular Data Paradox",
        subtitle: "How 3 billion genomic base pairs meet enterprise stream processing",
        narrationText:
          "Welcome to an unprecedented crossover between distributed enterprise software architecture and cutting-edge molecular biology.",
        visualMode: "cover",
      },
      {
        timeOffset: 25,
        title: "Zenodo Record 22955647",
        subtitle: "Wadï Mami's conceptual model: Spring Batch as a CRISPR-Cas9 Engine",
        narrationText:
          "In Zenodo record 22955647, researcher Wadï Mami published a breakthrough conceptual model: CRISPR-Batch, viewing Spring Batch as an execution engine for CRISPR-Cas9.",
        visualMode: "overview",
        highlightNode: "JOB",
      },
      {
        timeOffset: 50,
        title: "The Oncology Connection",
        subtitle: "Breast Cancer Awareness Month: Precision targeting of BRCA1 & BRCA2",
        narrationText:
          "In the context of Breast Cancer Awareness Month, targeting oncogenic mutations in BRCA1 and BRCA2 requires flawless molecular precision and atomic commit boundaries.",
        visualMode: "oncology",
        highlightNode: "BRCA1",
      },
    ],
  },
  {
    id: 2,
    chapterNumber: "02",
    title: "The Job & Step Lifecycle: Orchestrating the Protocol",
    shortDescription: "Mapping Spring JobExecution to clinical gene-editing campaigns, and Steps to sequential protocol phases.",
    duration: 85,
    timestamp: "01:15",
    category: "Architecture & Orchestration",
    bgImage: "/src/assets/images/spring_batch_flow_1791578163875.jpg",
    directorNotes: "Show Spring @Configuration flow diagram side-by-side with wet-lab transfection phases.",
    keyTakeaway: "A Job represents the entire experimental trial, while Steps isolate target selection, delivery, and validation.",
    zenodoCitation: "Zenodo 22955647: Step Execution & State Lifecycle",
    fullTranscript:
      "In Spring Batch, a Job is an explicit, repeatable batch process comprising sequential or parallel Steps. In Wadï Mami's model, a JobInstance represents a single gene therapy or CRISPR experimental campaign. The JobExecution tracks start times, exit codes, and failure statuses. Each Step models an isolated phase: Step 1 identifies target genomic coordinates; Step 2 synthesizes and validates the guide RNA; Step 3 delivers the Cas9 ribonucleoprotein complex into cells; and Step 4 validates the resulting double-strand break repair. If Step 2 fails guide RNA validation, the Job Execution halts safely without executing irreversible genomic cuts.",
    keyframes: [
      {
        timeOffset: 0,
        title: "Job as an Experimental Campaign",
        subtitle: "Spring JobInstance encapsulates target locus, cell line, and editing parameters",
        narrationText:
          "In Spring Batch, a Job is an explicit batch process. In this model, a JobInstance represents an entire gene editing campaign.",
        visualMode: "overview",
        highlightNode: "JOB_INSTANCE",
        codeSnippet: `@Bean
public Job crisprEditingJob(JobRepository repo,
                            Step targetSelectionStep,
                            Step cleavageStep) {
    return new JobBuilder("crisprBrca1Job", repo)
        .start(targetSelectionStep)
        .next(cleavageStep)
        .build();
}`,
      },
      {
        timeOffset: 40,
        title: "Step Isolation & Exit Codes",
        subtitle: "Decoupling target selection from physical endonuclease cleavage",
        narrationText:
          "Each Step models an isolated phase: target selection, gRNA validation, delivery, and cleavage. Failure in earlier steps aborts the run before irreversible DNA cuts occur.",
        visualMode: "overview",
        highlightNode: "STEPS",
      },
    ],
  },
  {
    id: 3,
    chapterNumber: "03",
    title: "ItemReader: Genomic Stream Ingestion",
    shortDescription: "Streaming 3 billion base pairs without heap exhaustion using chunked nucleotide readers.",
    duration: 85,
    timestamp: "02:40",
    category: "Data Streaming",
    bgImage: "/src/assets/images/cas9_dna_complex_1791578153428.jpg",
    directorNotes: "Highlight DNA double helix streaming base pairs into the ItemReader cursor.",
    keyTakeaway: "The ItemReader treats human chromosomes as infinite input streams with cursor-based state persistence.",
    zenodoCitation: "Zenodo 22955647: Reading Genomic FASTA/BAM Streams",
    fullTranscript:
      "A human haploid genome contains 3.2 billion base pairs. Loading an entire genome into JVM heap memory would cause immediate OutOfMemoryErrors. Enter the Spring Batch ItemReader. In CRISPR-Batch, an ItemReader acts as an intelligent genomic scanner. It reads nucleotide sequences sequentially from FASTA files, BAM alignment files, or Ensembl REST APIs. In our demonstration, the ItemReader streams the human BRCA1 locus on chromosome 17, reading 20-base-pair candidate windows along with their flanking genomic contexts. Returning null signals the end of the chromosome, completing stream ingestion.",
    keyframes: [
      {
        timeOffset: 0,
        title: "Cursor-Based Genomic Streaming",
        subtitle: "Reading multi-gigabyte chromosomes with zero heap exhaustion",
        narrationText:
          "Loading an entire genome into memory causes OutOfMemoryErrors. Enter the Spring Batch ItemReader, streaming nucleotides sequentially.",
        visualMode: "reader",
        highlightNode: "ITEM_READER",
        dnaSequence: "5'-GACCTACCTGAAACGTTAGTCAGGCTATGACG-3'",
        codeSnippet: `public class GenomicFastaItemReader implements ItemReader<DnaWindow> {
    private final BufferedReader fastaReader;
    @Override
    public DnaWindow read() throws Exception {
        String line = fastaReader.readLine();
        return (line != null) ? new DnaWindow(line) : null;
    }
}`,
      },
      {
        timeOffset: 45,
        title: "Streaming the BRCA1 Exon 11 Hotspot",
        subtitle: "Chromosome 17: 43,044,295 - 43,125,483 (GRCh38)",
        narrationText:
          "In our demonstration, the ItemReader streams the human BRCA1 locus on chromosome 17, emitting sliding windows for downstream evaluation.",
        visualMode: "reader",
        highlightNode: "BRCA1_STREAM",
        dnaSequence: "5'-ATGCAGAAAATCTTAGAGTGTCCCATCTGGTAAGTCAGC-3'",
      },
    ],
  },
  {
    id: 4,
    chapterNumber: "04",
    title: "ItemProcessor: gRNA Design & PAM Recognition",
    shortDescription: "Algorithmic PAM motif matching (5'-NGG-3'), off-target scoring, and item filtering.",
    duration: 90,
    timestamp: "04:05",
    category: "Biological Computation",
    bgImage: "/src/assets/images/cas9_dna_complex_1791578153428.jpg",
    directorNotes: "Demonstrate PAM recognition. If no NGG is found, ItemProcessor returns null (filter).",
    keyTakeaway: "Returning null in ItemProcessor mirrors natural Cas9 dissociation from non-target sequences.",
    zenodoCitation: "Zenodo 22955647: PAM Identification as Filtering Processor",
    fullTranscript:
      "The ItemProcessor is where the computational magic happens. In Spring Batch, an ItemProcessor transforms input items or filters them out by returning null. For SpCas9, the endonuclease requires a Protospacer Adjacent Motif, or PAM, sequence consisting of 5'-NGG-3' directly adjacent to the 20-base-pair protospacer. The ItemProcessor inspects every candidate window. If no valid PAM is found, it returns null, effortlessly dropping non-target DNA. If a valid PAM is detected, it synthesizes the complementary guide RNA, calculates the CFD off-target risk score, and passes an enriched CleavageProposal to the writer.",
    keyframes: [
      {
        timeOffset: 0,
        title: "The Canonical PAM Constraint",
        subtitle: "SpCas9 strictly requires 5'-NGG-3' for DNA interrogation",
        narrationText:
          "The ItemProcessor is where computation happens. For SpCas9, the enzyme requires a Protospacer Adjacent Motif, 5'-NGG-3'.",
        visualMode: "processor",
        highlightNode: "ITEM_PROCESSOR",
        dnaSequence: "5'-ACGTGTCAGACCTACGATCGGATGG-3'",
        pamIndex: 22,
        codeSnippet: `public class Cas9TargetProcessor 
       implements ItemProcessor<DnaWindow, CleavageProposal> {
    @Override
    public CleavageProposal process(DnaWindow window) {
        if (!window.hasPamMotif("NGG")) {
            return null; // Filter out non-target DNA
        }
        return new CleavageProposal(window, designGuideRna(window));
    }
}`,
      },
      {
        timeOffset: 45,
        title: "Off-Target Risk Filtering",
        subtitle: "Calculating mismatch tolerances and epigenetic accessibility",
        narrationText:
          "If no valid PAM is found, it returns null, dropping non-target DNA. If detected, it synthesizes guide RNA and scores off-target cleavage risk.",
        visualMode: "processor",
        highlightNode: "PAM_MATCH",
      },
    ],
  },
  {
    id: 5,
    chapterNumber: "05",
    title: "ItemWriter: Endonuclease Cleavage Execution",
    shortDescription: "Executing double-strand breaks exactly 3 base pairs upstream of PAM within commit boundaries.",
    duration: 85,
    timestamp: "05:35",
    category: "Execution & Cleavage",
    bgImage: "/src/assets/images/spring_batch_flow_1791578163875.jpg",
    directorNotes: "Animate Cas9 HNH and RuvC domains cleaving both DNA strands simultaneously.",
    keyTakeaway: "ItemWriter commits physical biological changes in atomic batches, mirroring database transactions.",
    zenodoCitation: "Zenodo 22955647: Physical Endonuclease Cleavage as ItemWriter",
    fullTranscript:
      "Once a chunk of candidate targets has been approved by the ItemProcessor, Spring Batch hands the collection to the ItemWriter. In CRISPR-Batch, this represents the actual catalytic cleavage. The Cas9 protein coordinates magnesium ions in two catalytic domains: the HNH domain cleaves the target strand complementary to the guide RNA, while the RuvC domain cleaves the non-target strand. The cut occurs precisely 3 base pairs upstream of the PAM. In software, the ItemWriter writes to a database; in CRISPR-Batch, it commits physical double-strand breaks into the genome.",
    keyframes: [
      {
        timeOffset: 0,
        title: "Catalytic Cleavage by HNH & RuvC Domains",
        subtitle: "Blunt-end double-strand break exactly 3bp upstream of PAM",
        narrationText:
          "Once targets are approved, Spring Batch hands them to ItemWriter. This represents physical catalytic cleavage by HNH and RuvC domains.",
        visualMode: "writer",
        highlightNode: "ITEM_WRITER",
        dnaSequence: "5'-ACGTGTCAGACCTACGATC | GGATGG-3'",
        pamIndex: 21,
        codeSnippet: `public class Cas9CleavageWriter implements ItemWriter<CleavageProposal> {
    @Override
    public void write(Chunk<? extends CleavageProposal> proposals) {
        for (CleavageProposal p : proposals) {
            cellCulture.induceDoubleStrandBreak(p.getCutCoordinate());
        }
    }
}`,
      },
      {
        timeOffset: 42,
        title: "The Biological Commit Boundary",
        subtitle: "Transition from non-covalent R-loop binding to irreversible phosphodiester hydrolysis",
        narrationText:
          "The cut occurs precisely 3 base pairs upstream of the PAM. In software, the writer commits to a database; here, it commits double-strand breaks.",
        visualMode: "writer",
        highlightNode: "DSB_COMMIT",
      },
    ],
  },
  {
    id: 6,
    chapterNumber: "06",
    title: "Chunking & Transactions: Batching Cellular Operations",
    shortDescription: "Managing high-throughput transfection batches and atomic commit boundaries.",
    duration: 80,
    timestamp: "07:00",
    category: "Scale & Transactions",
    bgImage: "/src/assets/images/spring_batch_flow_1791578163875.jpg",
    directorNotes: "Show chunk buffer filling up with 10 targets before atomic batch execution.",
    keyTakeaway: "Chunking optimizes resource consumption, matching 96-well and 384-well automated robotic screening.",
    zenodoCitation: "Zenodo 22955647: Chunk-Oriented Processing in Genomics",
    fullTranscript:
      "Why process items in chunks rather than one by one? In high-throughput CRISPR screens, testing thousands of potential guide RNAs individually creates severe latency and biochemical overhead. Spring Batch's chunk-oriented processing model reads and processes items one at a time, but aggregates them into a configurable Chunk size—say, 10 or 100 targets—before passing them to the ItemWriter inside a single transaction boundary. This perfectly matches automated high-throughput micro-fluidic arrays and 96-well robotic transfection workflows.",
    keyframes: [
      {
        timeOffset: 0,
        title: "Chunk-Oriented Processing",
        subtitle: "Read items iteratively, process in memory, commit in batches",
        narrationText:
          "Why process in chunks? In high-throughput CRISPR screens, testing individually creates severe biochemical overhead. Chunking aggregates operations.",
        visualMode: "chunk",
        highlightNode: "CHUNK_BUFFER",
        codeSnippet: `<step id="crisprScreeningStep">
  <tasklet>
    <chunk reader="fastaReader" 
           processor="pamProcessor" 
           writer="cas9Cleaver" 
           commit-interval="50"/>
  </tasklet>
</step>`,
      },
      {
        timeOffset: 40,
        title: "Matching Robotic Screening Arrays",
        subtitle: "Harmonizing commit intervals with 96-well and 384-well cell plates",
        narrationText:
          "Spring Batch's chunk model aggregates items into configurable sizes before calling the writer, matching automated robotic transfection workflows.",
        visualMode: "chunk",
        highlightNode: "COMMIT_INTERVAL",
      },
    ],
  },
  {
    id: 7,
    chapterNumber: "07",
    title: "Fault Tolerance: Skip & Retry in Cellular Repair",
    shortDescription: "Mapping Spring SkipPolicy and RetryPolicy to NHEJ indels and HDR template repair.",
    duration: 85,
    timestamp: "08:20",
    category: "Resilience & Repair",
    bgImage: "/src/assets/images/cas9_dna_complex_1791578153428.jpg",
    directorNotes: "Show how off-target exceptions trigger Spring SkipPolicy, while repair templates mirror Retry.",
    keyTakeaway: "Cells possess native fault tolerance pathways: error-prone NHEJ and high-fidelity HDR.",
    zenodoCitation: "Zenodo 22955647: Skip/Retry Policies as Biological Repair",
    fullTranscript:
      "No gene-editing system is completely error-free. What happens when an off-target mismatch occurs or a chromatin structure blocks Cas9 binding? In Spring Batch, FaultTolerantStepBuilder provides SkipPolicy and RetryPolicy. In CRISPR-Batch, a SkipPolicy models cellular error tolerance: when non-target mismatches occur, the system records an OffTargetException in the execution context without crashing the entire job. Meanwhile, RetryPolicy models cellular DNA repair: Non-Homologous End Joining introduces random insertions or deletions, while Homology-Directed Repair provides a repair template to rewrite damaged DNA correctly.",
    keyframes: [
      {
        timeOffset: 0,
        title: "Fault-Tolerant Step Building",
        subtitle: "Skipping off-target mismatches without crashing the genome pipeline",
        narrationText:
          "No gene-editing system is error-free. In Spring Batch, FaultTolerantStepBuilder provides SkipPolicy and RetryPolicy.",
        visualMode: "fault_tolerance",
        highlightNode: "SKIP_POLICY",
        codeSnippet: `return stepBuilderFactory.get("cleavageStep")
    .<DnaWindow, CleavageProposal>chunk(50)
    .reader(reader).processor(processor).writer(writer)
    .faultTolerant()
    .skip(OffTargetBindingException.class)
    .skipLimit(5)
    .retry(ChromatinInaccessibleException.class)
    .maxRetryAttempts(3)
    .build();`,
      },
      {
        timeOffset: 42,
        title: "NHEJ vs. HDR as Biological Recovery",
        subtitle: "Error-prone emergency ligation vs. high-fidelity template restoration",
        narrationText:
          "SkipPolicy logs exceptions in the execution context. Cellular repair pathways—NHEJ and HDR—act as biological retry mechanisms.",
        visualMode: "fault_tolerance",
        highlightNode: "HDR_REPAIR",
      },
    ],
  },
  {
    id: 8,
    chapterNumber: "08",
    title: "The Future: Automated Synthetic Biology",
    shortDescription: "Impact on oncological therapies, automated biofoundries, and summary of Zenodo 22955647.",
    duration: 75,
    timestamp: "09:45",
    category: "Synthesis & Outlook",
    bgImage: "/src/assets/images/crispr_batch_cover_1791578142910.jpg",
    directorNotes: "Closing summary with call-to-action for YouTube viewers and Zenodo reference.",
    keyTakeaway: "Software engineering abstractions make biological workflows reproducible, verifiable, and therapeutic.",
    zenodoCitation: "Zenodo Record 22955647 by Wadï Mami",
    fullTranscript:
      "By viewing CRISPR-Cas9 through the lens of Spring Batch, Wadï Mami's model in Zenodo 22955647 bridges two formerly distinct worlds. In oncology and Breast Cancer research, where developing therapies against BRCA1 mutations requires unprecedented accuracy, treating gene editing as a deterministic, chunk-processed, fault-tolerant batch job changes how we engineer biology. What seemed like living chemistry is also computational data processing. If you enjoyed this deep dive, check out the Zenodo paper linked in the description, subscribe for more bioinformatics architectures, and leave your thoughts in the comments below.",
    keyframes: [
      {
        timeOffset: 0,
        title: "Deterministic Biological Engineering",
        subtitle: "From artisanal wet lab benchwork to repeatable software-defined medicine",
        narrationText:
          "By viewing CRISPR-Cas9 through the lens of Spring Batch, Wadï Mami's model in Zenodo 22955647 bridges two formerly distinct worlds.",
        visualMode: "oncology",
        highlightNode: "SYNTHETIC_BIOLOGY",
      },
      {
        timeOffset: 38,
        title: "YouTube Community & Citation",
        subtitle: "Check out the Zenodo paper linked in the description below",
        narrationText:
          "Check out the Zenodo paper linked below, subscribe for more bioinformatics crossover architectures, and leave your thoughts in the comments.",
        visualMode: "cover",
      },
    ],
  },
];
