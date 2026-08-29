import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./errorBoundary.module.scss";
import { Button } from "@forever/ui-kit";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="container">
                    <div className={styles.error_boundary_wrapper}>
                        <div className={styles.error_boundary_content}>
                            <h6>Oops! Something went wrong.</h6>
                            <p>Try refreshing the page or click the button below.</p>
                            <Button onClick={this.handleReload}>
                                REFRESH
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
