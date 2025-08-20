import { useEffect } from "react";

export const HomePage: React.FC = () => {
    
    useEffect(() => {

    }, []);

    const handler = () => {

    };

    return (
        <>
            <header>
                <nav className="header-container">
                    <div className="logo">TBD</div>
                    <ul className="nav-links">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <button onClick={handler}>Sign-in</button>
                    <button onClick={handler}>Sign-up</button>
                </nav>
            </header>

            <main>
                <section className="hero">
                    <div className="container">
                        <h1>Manage Your Text Files Like Never Before</h1>
                        <p>Say goodbye to scattered documents and hello to organized, searchable, and collaborative text file management. TBD makes it simple.</p>
                        <button className="cta-button" onClick={handler}>Sign up</button>
                    </div>
                </section>

                <section className="features" id="features">
                    <div className="container">
                        <h2>Why Choose TBD?</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>Smart Organization</h3>
                                <p>Automatically categorize and tag your text files. Find any document in seconds with our powerful search and filtering system.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Built-in Editor</h3>
                                <p>Edit your text files directly in the browser with our intuitive editor. Support for markdown, plain text, and rich formatting.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Version Control</h3>
                                <p>Never lose your work again. Automatic versioning keeps track of all changes with easy rollback to any previous version.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Team Collaboration</h3>
                                <p>Share files with team members, set permissions, and collaborate in real-time. Comments and suggestions make teamwork seamless.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Cloud Sync</h3>
                                <p>Access your files from anywhere. Automatic cloud synchronization ensures your documents are always up-to-date across all devices.</p>
                            </div>
                            <div className="feature-card">
                                <h3>Secure & Private</h3>
                                <p>Enterprise-grade security with encryption at rest and in transit. Your sensitive documents are protected with the highest standards.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="how-it-works" id="how-it-works">
                    <div className="container">
                        <h2>How It Works</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h3>Upload Your Files</h3>
                                <p>Drag and drop your text files or import from your favorite cloud storage services.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h3>Organize Automatically</h3>
                                <p>Our AI-powered system categorizes and tags your content for easy discovery.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h3>Edit & Collaborate</h3>
                                <p>Make changes, invite team members, and work together in real-time.</p>
                            </div>
                            <div className="step">
                                <div className="step-number">4</div>
                                <h3>Stay Synced</h3>
                                <p>Access your organized content library from any device, anywhere.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 TBD. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
                </div>
            </footer>
        </>
    );
};
